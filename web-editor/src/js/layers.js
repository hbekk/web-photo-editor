import React, { useState, useEffect } from "react";
import '../css/layers.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { CgRename } from "react-icons/cg";


class CanvasManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.className = 'myCanvas';  
        this.canvases = [];
    }

    createCanvas(width, height, isTextLayer = false) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = this.className;
        canvas.id=`Layer ${this.canvases.length + 1}`;
        canvas.isTextLayer = isTextLayer;

        if (isTextLayer = true) {
            canvas.fontsize = 20; 
            canvas.font = "Arial";
            canvas.boldness = "";
            canvas.alignment = "";

        }
        this.container.append(canvas);
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

    renameCanvas(activeIndex, name) {   
        const newName = name;
        this.canvases[activeIndex].id = newName;
}

}


const Layers = ({canvasManager, setActiveCanvas, activeIndex, setActiveIndex}) => {
    const [layerName, setLayerName] = useState("");

    function handleSelectChange(index) {
        setActiveIndex(index);
        setActiveCanvas(canvasManager.canvases[index]);
    } 

    function handleDelete(index) {
        if (canvasManager.canvases.length == 1) {
            alert("Cannot delete last layer")
        } else {
            handleSelectChange(index - 1)
            canvasManager.deleteCanvas(index);
             
        }
    } 

    function handleRename(activeIndex) {
        const newName = window.prompt("Please rename the canvas", "");
        if (newName) {
            setLayerName(newName);
            canvasManager.renameCanvas(activeIndex, newName);
        }
    }



    function listAll() {
        return canvasManager.canvases
            .slice() 
            .reverse() 
            .map((canvas, reverseIndex) => {
                const originalIndex = canvasManager.canvases.length - 1 - reverseIndex;
                const buttonClassName = activeIndex === originalIndex ? 'list-item-active' : 'list-item';
                return (
                    <button 
                        key={canvas.id}  
                        onClick={() => {handleSelectChange(originalIndex)}} 
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
                <div className="buttons"> 
                <button
                onClick={() => {handleDelete(activeIndex)}}
                >
                <FaRegTrashAlt />
                </button>
                
                <button
                onClick={() => {handleRename(activeIndex)}}
                alt = "Rename"
                title = "Rename Layer"
                className="rename-button"
                >
                <CgRename />
                </button>
                </div>
            </div>
        </div>
    );
};

export { CanvasManager, Layers,};
