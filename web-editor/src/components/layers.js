import React, { useState} from "react";
import '../css/layers.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { CgRename } from "react-icons/cg";
import { RxText } from "react-icons/rx";
import { MdLayers } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoShapesSharp } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import {useCanvasContext} from "../context/CanvasProvider";


class CanvasManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.className = 'myCanvas';  
        this.canvases = [];
    }

    createCanvas(width, height, isTextLayer = false, isBase = false, isShapeLayer = false, isLayer = true) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.className = this.className;
        canvas.id=`Layer ${this.canvases.length + 1}`;
        canvas.isTextLayer = isTextLayer;
        canvas.isShapeLayer = isShapeLayer;
        canvas.isBase = isBase;
        canvas.isLayer = isLayer

        if (isTextLayer) {
            canvas.fontsize = 20; 
            canvas.font = "Arial";
            canvas.boldness = "";
            canvas.alignment = "";
            canvas.color="#ffffff";
        }

        if (isShapeLayer) {
            canvas.shapeSize = 20;
            canvas.shapeType = "";
            canvas.shapeColor = "#ffffff";
            canvas.outline = "";
            canvas.outline_color = "";

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
        this.canvases[0].isBase = true;
    }

    reorderUpCanvas(activeIndex) {
        // DOM Logic
        const referenceNode = this.container.children[activeIndex];
        const targetCanvas = this.canvases[activeIndex + 1];
        this.container.removeChild(targetCanvas);   
        this.container.insertBefore(targetCanvas, referenceNode)

         // Array Logic
        const tempCanvas = this.canvases[activeIndex];
        this.canvases[activeIndex] = this.canvases[activeIndex + 1];
        this.canvases[activeIndex + 1] = tempCanvas; 
    }

    reorderDownCanvas(activeIndex) {
        // DOM Logic
        const referenceNode = this.container.children[activeIndex - 1];
        const targetCanvas = this.canvases[activeIndex];
        this.container.insertBefore(targetCanvas, referenceNode)

        // Array Logic
        const tempCanvas = this.canvases[activeIndex];
        this.canvases[activeIndex] = this.canvases[activeIndex - 1];
        this.canvases[activeIndex - 1] = tempCanvas;            
    }

    renameCanvas(activeIndex, name) {   
        const newName = name;
        this.canvases[activeIndex].id = newName;
    }

}


const Layers = () => {
    const [layerName, setLayerName] = useState("");

    const { canvasManager,
        setActiveCanvas,
        setActiveIndex, activeIndex} = useCanvasContext();
    
    
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

    function handleUpReorder(index) {
        if (canvasManager.canvases.length == 1) {
            alert("You must have at least two layers to rearrange")
            return;
        }

        if ((canvasManager.canvases.length - 1) === index) {
            alert ("You cannot rearrange the top layer upwards");
            return;
        }

        if (index == 0) {
            alert("You cannot rearrange base layer");
        } else {
            canvasManager.reorderUpCanvas(index); 
            handleSelectChange(index + 1)

        }
        
    } 

    function handleDownReorder(index) {

        if (canvasManager.canvases.length == 1) {
            alert("You must have at least two layers to rearrange")
            return;
        }

        if (index == 0 || index == 1) {
            alert("You cannot rearrange base layer");
        } else {
            handleSelectChange(index - 1)
            canvasManager.reorderDownCanvas(index); 
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
                        {canvas.isShapeLayer ? <IoShapesSharp className="icon"/> : null}  
                        {canvas.isTextLayer ? <RxText className="icon"/> : null}
                        {canvas.isLayer ? <MdLayers className="icon"/> : null}
                        {canvas.isBase ? <FaLock className="lock-icon"/> : null}


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
                onClick={() => {handleRename(activeIndex)}}
                alt = "Rename"
                title = "Rename Layer"
                >
                <FaPlus />
                </button>

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

                <button
                onClick={() => {handleUpReorder(activeIndex)}}
                alt = "Rename"
                title = "Rename Layer"
                >
                <FaArrowUp />
                </button>

                <button
                onClick={() => {handleDownReorder(activeIndex)}}
                alt = "Rename"
                title = "Rename Layer"
                >
                <FaArrowDown />
                </button>
                </div>
            </div>
        </div>
    );
};

export { CanvasManager, Layers,};
