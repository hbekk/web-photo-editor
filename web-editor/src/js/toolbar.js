import { useEffect, useRef, useState } from 'react';
import '../css/toolbar.css';
import { RxText } from "react-icons/rx";
import { IoBrushSharp } from "react-icons/io5";
import { LuBoxSelect, LuLasso } from "react-icons/lu";
import { BsEyedropper } from "react-icons/bs";
import { PiPaintBucketBold } from "react-icons/pi";

const Toolbar = ({ canvasManager, width, height, setActiveIndex, setActiveCanvas, activeCanvas}) => {

    const [fontsize, setFontSize] = useState(20); 
    const [font, setNewFont] = useState("")
    const MAX = 500;

    const addText = () => {
        if (!canvasManager) return;  
        const width = canvasManager.canvases[canvasManager.canvases.length - 1].width
        const height = canvasManager.canvases[canvasManager.canvases.length - 1].height
        canvasManager.createCanvas(width, height, true);  

        let newCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
    
        if (!newCanvas) return;  
    
        const centerX = width / 2;
        const centerY = height / 2; 
        const ctx = newCanvas.getContext("2d");
    
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }
    
        ctx.font = `${newCanvas.fontsize}px ${newCanvas.font}`;  
        ctx.textAlign = "center";  
        ctx.textBaseline = "middle";
        let text = prompt("Enter your text")
        newCanvas.id = text;
        ctx.fillText(text, centerX, centerY);  

        setActiveIndex(canvasManager.canvases.length - 1)
        setActiveCanvas(canvasManager.canvases[canvasManager.canvases.length - 1])
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
    }


    return (
        <div className='toolbar-container'> 
            {activeCanvas?.isTextLayer && (
                <div className='text-adjust'>
                    <h4>Text:</h4>
                    <li>
                        <h5>{activeCanvas.fontsize}px</h5>
                        <input 
                            type="range" 
                            min="10" 
                            max={MAX} 
                            value={activeCanvas.fontsize}  
                            className="slider" 
                            id="myRange" 
                            onChange={handleSliderChange}  
                        />
                    </li>
                    <li>
                        <button onClick={handleFontChange}></button>
                    </li>
                    <li>
                        <a> {activeCanvas.font}</a>
                    </li>
                </div>
            )}
            <nav className="toolbar">
                <ul>
                    <li>
                        <a onClick={addText}><RxText /></a>
                    </li>
                    <li>
                        <a ><IoBrushSharp /></a>
                    </li>
                    <li>
                        <a><LuBoxSelect /></a>
                    </li>
                    <li>
                        <a><LuLasso /></a>
                    </li>
                    <li>
                        <a><BsEyedropper /></a>
                    </li>
                    <li>
                        <a><PiPaintBucketBold /></a>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export { Toolbar };
