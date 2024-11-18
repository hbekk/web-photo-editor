import React, { useEffect, useRef } from 'react';
import '../css/navbar.css';
import { useCanvasContext } from '../context/CanvasProvider'; // Import your context
import Filters from '../utils/effects';
import ImageEffects from "./image";

export const Navbar = () => {
    const { setImage, activeCanvas } = useCanvasContext(); // Access setImage and activeCanvas from context
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

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul>
                    <li>
                        <h1 className="logo">Web Editor &nbsp;|</h1>
                    </li>
                    <li>
                        <div className="dropdown">
                            <a className="dropbtn">File <i className="fa fa-caret-down"></i></a>
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
                                <a href="#">Crop</a>
                                <a href="#">Resize</a>
                                <a onClick={() => ImageEffects.rotatecw(canvasRef.current)}>Rotate Clockwise</a>
                                <a onClick={() => ImageEffects.rotateccw(canvasRef.current)}>Rotate Counter Clockwise</a>
                                <a onClick={() => ImageEffects.flipHorisontally(canvasRef.current)}>Flip Horizontally</a>
                                <a onClick={() => ImageEffects.flipVertically(canvasRef.current)}>Flip Vertically</a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="dropdown">
                            <a className="dropbtn">Clipboard <i className="fa fa-caret-down"></i></a>
                            <div className="dropdown-content">
                                <a href="#">Copy</a>
                                <a href="#">Paste</a>
                                <a href="#">Cut</a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="dropdown">
                            <a className="dropbtn">Effects <i className="fa fa-caret-down"></i></a>
                            <div className="dropdown-content">
                                <a onClick={() => Filters.gaussianBlur(canvasRef.current)}>Gaussian Blur</a>
                                <a onClick={() => Filters.sobel(canvasRef.current)}>Sobel</a>
                                <a onClick={() => Filters.binary(canvasRef.current)}>Binary</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
