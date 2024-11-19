import React, {useState } from 'react';
import '../css/toolbar.css';
import { RxText } from "react-icons/rx";
import { IoBrushSharp } from "react-icons/io5";
import {LuBoxSelect, LuLasso} from "react-icons/lu";
import { MdTextFields } from "react-icons/md";
import { IoShapesSharp } from "react-icons/io5";
import {TbLassoPolygon} from "react-icons/tb";
import {useCanvasContext} from "../context/CanvasProvider";
import {BiPointer} from "react-icons/bi";
import {FaAngleDown} from "react-icons/fa";

import {polySelectionRemover, selectionRemover} from "../utils/selectionRemover";
import { FaEraser } from "react-icons/fa";


const ColorPicker = ({ color, onChange}) => {
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
    const [shapeMultiplier, setShapeMultiplier] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');



    const { canvasManager,
            setActiveIndex,
            setActiveCanvas,
            activeCanvas,
            setActiveTool,
            activeTool,
            setSelectionCanvas,
            setSelection,
            setPolygonPoints,
            brushSize,
            brushColor,
            setBrushColor,
            setBrushSize,
            drawPattern,
            setDrawPattern} = useCanvasContext();

    const patterns = [
        "Square",
        "Spray",
    ];
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

    const shapes = [
        "Square",
        "Circle",
        "Rectangle",
    ]


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
        const width = canvasManager.canvases[0].width
        const height = canvasManager.canvases[0].height
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

    const handleFontSlider = (e) => {
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

    // BRUSH HANDLING

    const handleBrushSlider = (e) => {
        const newSize = e.target.value;
        setBrushSize(newSize);
    }

    const handleBrushColorChange = (newColor) => {
        setBrushColor(newColor);
    }

    const handleBrushPatternChange = (pattern) => {
        setDrawPattern(pattern);
    }

    
    // SHAPE HANDLING

    const addShape = () => {
        if (!canvasManager) return;  
        const width = canvasManager.canvases[0].width
        const height = canvasManager.canvases[0].height
        canvasManager.createCanvas(width, height);  
        let newCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
        newCanvas.isShapeLayer = true;
        newCanvas.isLayer = false;
        newCanvas.shapeType = "Square";
        newCanvas.color = "#ffffff";
        newCanvas.outlineColor = "#ffffff";
        newCanvas.shapeSize = 1;
    
        if (!newCanvas) return;  
    
        const centerX = width / 2;
        const centerY = height / 2; 
        const ctx = newCanvas.getContext("2d");
    
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }

        ctx.fillStyle = "white";
        ctx.fillRect(centerX, centerY, 50, 50);
        setActiveIndex(canvasManager.canvases.length - 1)
        setActiveCanvas(newCanvas);
    };

    const handleShapeChange = (newShape) => {
        activeCanvas.shapeType = newShape;

        const ctx = activeCanvas.getContext("2d");
        ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

        const centerX = activeCanvas.width / 2;
        const centerY = activeCanvas.height / 2;
        ctx.fillStyle = "white";

        if (newShape === "Square") {
            ctx.fillRect(
                centerX - (50 * activeCanvas.shapeSize) / 2,
                centerY - (50 * activeCanvas.shapeSize) / 2,
                50 * activeCanvas.shapeSize,
                50 * activeCanvas.shapeSize
            );

        } else if (newShape === "Circle") {
            ctx.beginPath();
            ctx.arc(centerX, centerY, (50 * activeCanvas.shapeSize) / 2, 0, 2 * Math.PI);
            ctx.fill();

        } else if (newShape === "Rectangle") {
            ctx.fillRect(
                centerX - (100 * activeCanvas.shapeSize) / 2,
                centerY - (50 * activeCanvas.shapeSize) / 2,
                100 * activeCanvas.shapeSize,
                50 * activeCanvas.shapeSize
            );
        }

    };


    const handleShapeSlider = (e) => {
        const newSize = e.target.value;
        setShapeMultiplier(newSize);
        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");
            if (ctx) {

                if (activeCanvas.shapeType === "Square") {
                    ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
                    const centerX = activeCanvas.width / 2 - (50 * shapeMultiplier) / 2;
                    const centerY = activeCanvas.height / 2 - (50 * shapeMultiplier) / 2;
                    ctx.fillStyle = "white";
                    ctx.fillRect(centerX, centerY, 50 * shapeMultiplier, 50 * shapeMultiplier);
                    activeCanvas.shapeSize = shapeMultiplier;
                }

                if (activeCanvas.shapeType === "Circle") {
                    ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
                    const centerX = activeCanvas.width / 2;
                    const centerY = activeCanvas.height / 2;
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, (50 * shapeMultiplier) / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    activeCanvas.shapeSize = shapeMultiplier;
                }

                if (activeCanvas.shapeType === "Rectangle") {
                    ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
                    const centerX = activeCanvas.width / 2 - (100 * shapeMultiplier) / 2;
                    const centerY = activeCanvas.height / 2 - (50 * shapeMultiplier) / 2;
                    ctx.fillStyle = "white";
                    ctx.fillRect(centerX, centerY, 100 * shapeMultiplier, 50 * shapeMultiplier);
                    activeCanvas.shapeSize = shapeMultiplier;
                }


            }
        }
    };

    // Selection Handling

    const handleSelection = (tool) => {
        if (activeTool === "selection" || activeTool === "lasso-selection") {
            selectionRemover(setSelectionCanvas, setSelection);
        }
        if (activeTool === "poly-selection") {
            polySelectionRemover(setSelectionCanvas, setPolygonPoints);
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
                                onChange={handleFontSlider}
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

            {(activeTool === "selection" || activeTool==="poly-selection" || activeTool==="lasso-selection")  && (
                <div className='text-adjust'>
                    <h4>Selection: </h4>
                    <button className="confirm-btn" onClick={() => handleSelection("pointer")}> Complete Selection</button>
                </div>
            )}

            {(activeTool === "brush")  && (
                <div className='text-adjust' >
                    <IoBrushSharp/>
                    <div className="dropdown">
                        <a className="dropbtn">Size: {brushSize}px <i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={brushSize}
                                className="slider"
                                id="myRange"
                                onChange={handleBrushSlider}
                            />
                        </div>
                    </div>
                    <div className="dropdown">
                        <a className="dropbtn">Pattern: {drawPattern} <i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            {patterns.map((pattern, index) => (
                                <a
                                    key={index}
                                    onClick={() => handleBrushPatternChange(pattern)}
                                >
                                    {pattern}
                                </a>
                            ))}
                        </div>
                    </div>
                    <ColorPicker color={brushColor} onChange={handleBrushColorChange}/></div>
            )}

            {(activeTool === "eraser")  && (
                <div className='text-adjust' >
                    <FaEraser/>
                    <div className="dropdown">
                        <a className="dropbtn">Size: {brushSize}px <i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={brushSize}
                                className="slider"
                                id="myRange"
                                onChange={handleBrushSlider}
                            />
                        </div>
                    </div>
                  </div>
            )}

            {activeCanvas?.isShapeLayer  && (
                <div className='text-adjust'>
                    <IoShapesSharp/>
                    <div className="dropdown">
                        <a className="dropbtn">Size: {activeCanvas.shapeSize}<i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            <input
                                type="range"
                                min="1"
                                max="13"
                                value={shapeMultiplier}
                                className="slider"
                                id="myRange"
                                onChange={handleShapeSlider}
                            />
                        </div>
                    </div>
                    <div className="dropdown">
                        <a className="dropbtn">Type: {activeCanvas.shapeType} <i><FaAngleDown/></i></a>
                        <div className="dropdown-content">
                            {shapes.map((shape, index) => (
                                <a
                                    key={index}
                                    onClick={() => handleShapeChange(shape)}
                                >
                                    {shape}
                                </a>
                            ))}
                        </div>
                    </div>
                    <h5>Fill </h5>
                    <ColorPicker color={brushColor} onChange={handleBrushColorChange}/>
                    <h5>Stroke</h5>
                    <ColorPicker color={brushColor} onChange={handleBrushColorChange}/>


                </div>

            )}

            <nav className="toolbar">
                <ul>
                    <li>
                        <a className={(activeTool === "pointer") ? "active" : ""}
                           onClick={() => handleSelection("pointer")}>
                            <BiPointer/>
                        </a>
                    </li>
                    <li>
                        <a onClick={() => {
                            addText()
                        }}><RxText/></a>
                    </li>
                    <li>
                        <a className={activeTool === "brush" ? "active" : ""}
                           onClick={() => handleSelection("brush")}
                        ><IoBrushSharp/></a>
                    </li>
                    <li>
                        <a className={activeTool === "eraser" ? "active" : ""}
                           onClick={() => handleSelection("eraser")}>
                            <FaEraser/>
                        </a>
                    </li>
                    <li>
                        <a className={activeTool === "shape" ? "active" : ""}
                           onClick={() => addShape()}
                           ><IoShapesSharp/></a>
                    </li>
                    <li>
                        <a className={activeTool === "selection" ? "active" : ""}
                           onClick={() => handleSelection("selection")}>
                            <LuBoxSelect/>
                        </a>
                    </li>
                    <li>
                        <a className={activeTool === "lasso-selection" ? "active" : "" }
                           onClick={() => handleSelection("lasso-selection")}
                        ><LuLasso/></a>
                    </li>
                    <li>
                        <a className={activeTool === "poly-selection" ? "active" : "" }
                            onClick={() => handleSelection("poly-selection")}><TbLassoPolygon/></a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export {Toolbar};
