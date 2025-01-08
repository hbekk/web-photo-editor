import React, { useEffect, useState, useRef } from 'react';
import '../css/navbar.css';
import { useCanvasContext } from '../context/CanvasProvider';
import Filters from '../utils/effects';
import ImageEffects from "../utils/image";
import {crop, lassoCrop, polyCrop} from "../utils/selectionCrop";
import {lassoCopy, polygonalCopy, rectangleCopy} from "../utils/selectionCopy";
import {lassoCut, polygonalCut, rectangleCut} from "../utils/selectionCut";


export const Navbar = () => {

    const { setImage,
            activeCanvas,
            selection,
            activeTool,
            polygonPoints,
            lassoPoints,
            canvasManager,
            setActiveCanvas,
            setActiveIndex,
            maxWidth,
            maxHeight,
            setWidth,
            setHeight,
            BG,
            setBG} = useCanvasContext();

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newModalVisible, setNewModalVisible] = useState(false);

    useEffect(() => {
        if (activeCanvas) {
            canvasRef.current = activeCanvas;
        }
    }, [activeCanvas]);

    const upload = (event) => {
        event.preventDefault();
        fileInputRef.current.click(); // Trigger file input click
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleProperties = () => {
        if (canvasManager.canvases.length === 0) {
            alert("Please create project first")
        } else {
            setModalVisible(true);
        }
    }

    const download = () => {
        if (!canvasManager.canvases || canvasManager.canvases.length === 0) {
            console.error("No canvases to combine.");
            return;
        }

        const baseCanvas = canvasManager.canvases[0];

        const baseRect = baseCanvas.getBoundingClientRect();
        const baseWidth = baseRect.width;
        const baseHeight = baseRect.height;

        const combinedCanvas = document.createElement("canvas");
        combinedCanvas.width = baseWidth;
        combinedCanvas.height = baseHeight;

        const context = combinedCanvas.getContext("2d");

        for (const canvas of canvasManager.canvases) {
            const rect = canvas.getBoundingClientRect();
            const computedWidth = rect.width;
            const computedHeight = rect.height;

            const canvasOffsetX = rect.left - baseRect.left;
            const canvasOffsetY = rect.top - baseRect.top;

            context.drawImage(
                canvas,
                canvasOffsetX,
                canvasOffsetY,
                computedWidth,
                computedHeight
            );
        }

        const dataURL = combinedCanvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = prompt("Enter your file name", "image.png");
        link.click();
        combinedCanvas.remove();
    }

    /*function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const width = parseInt(formData.get("Width"), 10);
        const height = parseInt(formData.get("Height"), 10);
        const background = formData.get("Background");

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert("Width and height must be positive numbers.");
            return;
        }

        if (width && height && background) {
            canvasManager.deleteAll();
            setHeight(height);
            setWidth(width);
            setBG(background);

            canvasManager.createCanvas(width, height);
            const canvas = canvasManager.canvases[0];
            canvas.isBase = true;
            setActiveCanvas(canvas);

            if (background === "white" || background === "black") {
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            alert("Please enter values for all fields");
        }

        setNewModalVisible(false);
    } */


    const newFile = () => {
        if (activeTool === "selection" || activeTool === "poly-selection" || activeTool === "lasso-selection") {
            alert("Please complete your selection first")
            return;
        }
        canvasManager.deleteAll();

        //setNewModalVisible(true);
    };

    // CUT, CROP AND COPY
    const handleCrop = () => {
        if (activeCanvas.isBase) return;
        const canvas = activeCanvas;

        if (activeTool === "selection") {
            crop(canvas,selection);
        }

        if (activeTool === "poly-selection") {
            polyCrop(canvas, polygonPoints);
        }

        if (activeTool === "lasso-selection") {
            lassoCrop(canvas, lassoPoints)
        }

    }

    const handleCopy = () => {
        const canvas = activeCanvas;


        if (activeTool === "selection") {
            rectangleCopy(canvas, selection, canvasManager);
        }
        if (activeTool === "poly-selection") {
            polygonalCopy(canvas, polygonPoints, canvasManager);
        }
        if (activeTool === "lasso-selection") {
            lassoCopy(canvas, lassoPoints, canvasManager);
        }

        setActiveCanvas(canvasManager.canvases[canvasManager.canvases.length - 1]);
        setActiveIndex(canvasManager.canvases.length - 1);
    }

    const handleCut = () => {
        const canvas = activeCanvas;

        if (activeTool === "selection") {
            rectangleCut(canvas, selection, canvasManager);
        }
        if (activeTool === "poly-selection") {
            polygonalCut(canvas, polygonPoints, canvasManager);
        }
        if (activeTool === "lasso-selection") {
            lassoCut(canvas, lassoPoints, canvasManager);
        }

        setActiveCanvas(canvasManager.canvases[canvasManager.canvases.length - 1]);
        setActiveIndex(canvasManager.canvases.length - 1);
    }

    return (
        <>
        {modalVisible && canvasManager && (
            <div className="modal-container">
                    <div className="modal-wrapper">
                        <h1>Properties</h1>
                        <div className="modal-content">
                            <ul>
                                <li>
                                    <h4>Layer Count: {canvasManager.canvases.length}</h4>
                                    <h4>Project Width: {maxWidth}px</h4>
                                    <h4>Project Height: {maxHeight}px</h4>
                                </li>
                            </ul>
                            <button className="close-btn" onClick={() => setModalVisible(false)}>
                                Close
                            </button>
                        </div>
                    </div>
            </div>
        )}

            {newModalVisible && canvasManager && (
                <div className="modal-container">
                    <div className="modal-wrapper">
                        <h1>New project</h1>
                        <div className="modal-content">
                            <ul>
                                <li>
                                    <form method="post" >
                                        <label>
                                            Project width (px): <input name="Width" type="number" min="1" required/>
                                        </label>
                                        <hr/>
                                        <label>
                                            Project height (px): <input name="Height" type="number" min="1" required/>
                                        </label>
                                        <hr/>

                                        <label>
                                            <input type="radio" name="Background" value="transparent"
                                                   required/> Transparent
                                        </label>
                                        <hr/>
                                        <label>
                                            <input type="radio" name="Background" value="white" required/> White
                                        </label>
                                        <hr/>
                                        <label>
                                            <input type="radio" name="Background" value="black" required/> Black
                                        </label>
                                        <hr/>

                                        <button className="close-btn" type="submit">
                                            Create
                                        </button>
                                        <button className="close-btn" onClick={() => setNewModalVisible(false)}>
                                            Cancel
                                        </button>
                                    </form>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <div className="navbar-container">
                <nav className="navbar">
                    <ul>
                        <li>
                            <img src="/logo.webp" alt="Logo"/>
                            <h1 className="logo">Web Photo Editor &nbsp;|
                            </h1>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a className="dropbtn">File</a>
                                <div className="dropdown-content">
                                <a onClick={newFile}>New...</a>
                                    <div id="upload">
                                        <a onClick={upload}>Open</a>
                                        <input type="file" onChange={handleFileChange} multiple accept="image/" ref={fileInputRef}
                                               id="imageLoader" name="imageLoader"/>
                                    </div>
                                    <a onClick={download}>Save As...</a>
                                    <a onClick={handleProperties}>Properties</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a className="dropbtn">Image <i className="fa fa-caret-down"></i></a>
                                <div className="dropdown-content">
                                    <a onClick={() => handleCrop()}>Crop</a>
                                    <a onClick={() => ImageEffects.rotatecw(canvasRef.current)}>Rotate Clockwise</a>
                                    <a onClick={() => ImageEffects.rotateccw(canvasRef.current)}>Rotate Counter
                                        Clockwise</a>
                                    <a onClick={() => ImageEffects.flipHorisontally(canvasRef.current)}>Flip
                                        Horizontally</a>
                                    <a onClick={() => ImageEffects.flipVertically(canvasRef.current)}>Flip
                                        Vertically</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a className="dropbtn">Clipboard <i className="fa fa-caret-down"></i></a>
                                <div className="dropdown-content">
                                    <a onClick={() => handleCopy()}>Copy & Paste</a>
                                    <a onClick={() => handleCut()}>Cut & Paste</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a className="dropbtn">Effects <i className="fa fa-caret-down"></i></a>
                                <div className="dropdown-content">
                                    <a onClick={() => Filters.gaussianBlur(canvasRef.current)}>Gaussian Blur</a>
                                    <a onClick={() => Filters.sobelx(canvasRef.current)}>Sobel X</a>
                                    <a onClick={() => Filters.sobely(canvasRef.current)}>Sobel Y</a>
                                    <a onClick={() => Filters.binary(canvasRef.current)}>Binary</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </>

    );
};
