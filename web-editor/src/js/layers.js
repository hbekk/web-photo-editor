import React, { useState, useEffect } from "react";
import '../css/layers.css';

class CanvasManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.className = 'myCanvas';  
        this.canvases = [];
    }

    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.id = `Layer ${this.canvases.length + 1}`; 
        canvas.className = this.className;
        this.container.appendChild(canvas);
        this.canvases.push(canvas); 
        console.log("Canvas created:", canvas.id);
        console.log(this.canvases)
        this.onCanvasCreated();
    }

    deleteCanvas(activeIndex) {
        this.container.removeChild(this.canvases[activeIndex]);
        this.canvases.splice(activeIndex, 1);

        for (let i = 0; i < this.canvases.length; i++) {

            if (this.canvases[i].id.startsWith("Layer")){
                this.canvases[i].id = `Layer ${i+1}`; 
            }
        }

    }

}


const Layers = ({canvasManager, setActiveCanvas}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    function handleSelectChange(index) {
        setActiveIndex(index);
        setActiveCanvas(canvasManager.canvases[index]);
    } 

    function listAll() {
        return canvasManager.canvases.map((canvas, index) => {
            const buttonClassName = activeIndex === index ? 'list-item-active' : 'list-item';
            return (
                <button 
                    key={index}
                    onClick={() => handleSelectChange(index)} 
                    id={canvas.id}
                    className={buttonClassName}
                >
                    {canvas.id}
                </button>
            );
        });
    }

    return (
        <div className="layers-container">
            <div className="layers-title">
                <h3>Layers</h3>
            </div>
            
            <div className="layers-list">
                {canvasManager && canvasManager.canvases.length > 0 
                    ? listAll() 
                    : <div>No layers available</div>}
            </div>

            <div className="layers-bar">
                <button
                onClick={() => {setActiveIndex(activeIndex - 1); canvasManager.deleteCanvas(activeIndex);}}
                >
                Delete
                </button>
            </div>
        </div>
    );
};

export { CanvasManager, Layers,};
