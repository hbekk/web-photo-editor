import React from "react";
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
        this.onCanvasCreated();
    }

    listAll() {
        return this.canvases.map((canvas, index) => ( 
            <div className="list-item" key={index}>
                <a id={canvas.id}>{canvas.id}</a>
            </div>   
        ));
    }

    renderLayers() {
        return this.listAll();
    }
}

const Layers = ({ canvasManager }) => {
    return (
        <div className="layers-container">
            <div className="layers-title">
                <h3>Layers</h3>
            </div>
            
            <div className="layers-list">
                {canvasManager && canvasManager.canvases.length > 0 
                    ? canvasManager.listAll() 
                    : <div>No layers available</div>}
            </div>

            <div className="layers-bar">
                <h3>Layers</h3>
            </div>
        </div>
    );
};

export { CanvasManager, Layers };
