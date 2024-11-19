import React, { useEffect, useState, useRef } from 'react';
import '../css/navbar.css';
import { useCanvasContext } from '../context/CanvasProvider';
import Filters from '../utils/effects';
import ImageEffects from "./image";
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
            setActiveIndex} = useCanvasContext();

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

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

    const download = () => {
        const filename = prompt("Enter a filename:", "canvas-image");
        if (filename) {
            const canvas = activeCanvas;
            const canvasUrl = canvas.toDataURL();
            const createEl = document.createElement('a');
            createEl.href = canvasUrl;
            createEl.download = `${filename}.png`;
            createEl.click();
            createEl.remove();
        }
    };

    const newFile = () => {
        const canvas = activeCanvas;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // CUT, CROP AND COPY
    const handleCrop = () => {
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
                                    <input type="file" onChange={handleFileChange} ref={fileInputRef} id="imageLoader" name="imageLoader" />
                                </div>
                                <a onClick={download}>Save Layer...</a>
                                <a href="#">Properties</a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="dropdown">
                            <a className="dropbtn">Image <i className="fa fa-caret-down"></i></a>
                            <div className="dropdown-content">
                                <a onClick={() => handleCrop()}>Crop</a>
                                <a href="#">Resize</a>
                                <a onClick={() => ImageEffects.rotatecw(canvasRef.current)}>Rotate Clockwise</a>
                                <a onClick={() => ImageEffects.rotateccw(canvasRef.current)}>Rotate Counter
                                    Clockwise</a>
                                <a onClick={() => ImageEffects.flipHorisontally(canvasRef.current)}>Flip
                                    Horizontally</a>
                                <a onClick={() => ImageEffects.flipVertically(canvasRef.current)}>Flip Vertically</a>
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
    );
};
