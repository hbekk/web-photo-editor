import React, { useEffect, useRef, useState } from 'react';
import '../css/toolbar.css';
import { RxText } from "react-icons/rx";
import { IoBrushSharp } from "react-icons/io5";
import {LuBoxSelect, LuLasso, LuPointer} from "react-icons/lu";
import { BsEyedropper } from "react-icons/bs";
import { PiPaintBucketBold } from "react-icons/pi";
import { MdTextFields } from "react-icons/md";
import { IoShapesSharp } from "react-icons/io5";
import {TbLassoPolygon} from "react-icons/tb";

import {useCanvasContext} from "../context/CanvasProvider";
import {LiaMousePointerSolid} from "react-icons/lia";
import {BiPointer} from "react-icons/bi";
import Filters from "../utils/effects";
import {FaAngleDown} from "react-icons/fa";

const ColorPicker = ({ color, onChange, activeCanvas }) => {
    return (
        <div className='color-picker'> 
        <input 
            type="color" 
            value={color} 
            onChange={(e) => onChange(e.target.value)} 
        />
         </div>

    );
};

const Toolbar = () => {
    const [fontsize, setFontSize] = useState(20); 
    const [color, setColor] = useState("#ffffff");

    const { canvasManager,
            width,
            height,
            setActiveIndex,
            setActiveCanvas,
            activeCanvas,
            setActiveTool,
            activeTool, setSelectionCanvas} = useCanvasContext();


    const fonts = [
        "Arial", 
        "Verdana", 
        "Impact", 
        "Times New Roman", 
        "Tahoma",
        "Georgia",
        "Courier New",
        "Garamond",
        "Trebuchet MS"
      ];

    const thickness = [
        200, 
        500, 
        800, 
      ]; 



    const MAX = 500;
    const [font, setFont] = useState("Arial")

    const handleColorChange = (newColor) => {
        setColor(newColor);
        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
                ctx.fillStyle = newColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const text = activeCanvas.id;
                const centerX = activeCanvas.width / 2;
                const centerY = activeCanvas.height / 2;
                ctx.fillText(text, centerX, centerY);
                activeCanvas.color = newColor
            }
        }
    };

//// TEXT HANDLING 
    const addText = () => {
        if (!canvasManager) return;  
        const width = canvasManager.canvases[canvasManager.canvases.length - 1].width
        const height = canvasManager.canvases[canvasManager.canvases.length - 1].height
        canvasManager.createCanvas(width, height, true);  

        let newCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
        newCanvas.isLayer = false;

    
        if (!newCanvas) return;  
    
        const centerX = width / 2;
        const centerY = height / 2; 
        const ctx = newCanvas.getContext("2d");
    
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }
        ctx.fillStyle = "#ffffff";  
        ctx.font = `${newCanvas.fontsize}px ${newCanvas.font}`;  
        ctx.textAlign = "center";  
        ctx.textBaseline = "middle";
        let text = prompt("Enter your text");
        newCanvas.id = text;
        ctx.fillText(text, centerX, centerY);  

        setActiveIndex(canvasManager.canvases.length - 1)
        setActiveCanvas(newCanvas);
        handleSelection("pointer");
    };

    const handleSliderChange = (e) => {
        const newSize = e.target.value;
        setFontSize(newSize);
        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");
            if (ctx) {
                ctx.font = `${newSize}px ${activeCanvas.font}`;  
                ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);  
                const text = activeCanvas.id;
                const centerX = activeCanvas.width / 2;
                const centerY = activeCanvas.height / 2;
                ctx.fillText(text, centerX, centerY); 
                activeCanvas.fontsize = fontsize;
            }
        }
    };

    const handleFontChange = (newFont) => {
        setFont(newFont);  
        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height); 
                ctx.font = `${activeCanvas.fontsize}px ${newFont}`; 
                ctx.fillStyle = activeCanvas.color;  
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const text = activeCanvas.id;
                const centerX = activeCanvas.width / 2;
                const centerY = activeCanvas.height / 2;
                ctx.fillText(text, centerX, centerY);  
                activeCanvas.font = newFont;  
            }
        }
    }; 
    
    // SHAPE HANDLING

    const addShape = () => {
        if (!canvasManager) return;  
        const width = canvasManager.canvases[canvasManager.canvases.length - 1].width
        const height = canvasManager.canvases[canvasManager.canvases.length - 1].height
        canvasManager.createCanvas(width, height);  
        let newCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
        newCanvas.isShapeLayer = true;
        newCanvas.isLayer = false;

    
        if (!newCanvas) return;  
    
        const centerX = width / 2;
        const centerY = height / 2; 
        const ctx = newCanvas.getContext("2d");
    
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }

        ctx.fillStyle = "white";
        ctx.fillRect(centerX, centerY, 100, 100);

        setActiveIndex(canvasManager.canvases.length - 1)
        setActiveCanvas(newCanvas);
    };

    // Selection Handling

    const handleSelection = (tool) => {

        if (activeTool === "selection") {
            let selectionCanvasTemp = document.getElementById("selection-canvas");
            if (selectionCanvasTemp) {
                document.body.removeChild(selectionCanvasTemp);
                setSelectionCanvas(null);
            }
        }

        console.log(`Tool selected: ${tool}`);
        setActiveTool(tool);
    }



    return (
        <div className='toolbar-container'>
            {activeCanvas?.isTextLayer && (
                <div className='text-adjust'>
                    <MdTextFields />
                    <div className="dropdown">
                        <a className="dropbtn">Size: {activeCanvas.fontsize}px <i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            <input 
                                type="range" 
                                min="10" 
                                max={MAX} 
                                value={activeCanvas.fontsize}  
                                className="slider" 
                                id="myRange" 
                                onChange={handleSliderChange}  
                            />
                        </div>
                    </div> 
                        <div className="dropdown">
                            <a className="dropbtn">Font: {activeCanvas.font} <i><FaAngleDown/></i></a>
                            <div className="dropdown-content">
                                {fonts.map((fontName, index) => (
                                <a 
                                    key={index}
                                    onClick={() => handleFontChange(fontName)}
                                    style={{ fontFamily: fontName }}
                                >
                                    {fontName}
                                </a>
                                ))}
                            </div>
                            </div>
                    <ColorPicker color={activeCanvas.color} onChange={handleColorChange} />

                </div>
            )}

            {activeTool === "selection"  && (
                <div className='text-adjust'>
                    <h4>Selection</h4>
                    <button onClick={() => handleSelection("pointer")}>Complete Selection</button>
                </div>
            )}


            <nav className="toolbar">
                <ul>
                    <li>
                        <a className={activeTool === "pointer" ? "active" : ""}
                           onClick={() => handleSelection("pointer")}>
                            <BiPointer/>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => {addText()}}><RxText/></a>
                    </li>
                    <li>
                        <a><IoBrushSharp/></a>
                    </li>
                    <li>
                        <a onClick={addShape}><IoShapesSharp/></a>
                    </li>
                    <li>
                        <a className={activeTool === "selection" ? "active" : ""}
                           onClick={() => handleSelection("selection")}>
                            <LuBoxSelect/>
                        </a>
                    </li>
                    <li>
                        <a><LuLasso/></a>
                    </li>
                    <li>
                        <a><TbLassoPolygon/></a>
                    </li>
                    <li>
                        <a><PiPaintBucketBold/></a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export {Toolbar};
