import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CanvasManager } from '../components/layers';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
    const [canvasManager, setCanvasManager] = useState(null);
    const canvasRef = useRef(null);
    const [activeCanvas, setActiveCanvas] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTool, setActiveTool] = useState("pointer");
    const [selectionCanvas, setSelectionCanvas] = useState(null); // Store the selection canvas
    const [layerCount, setLayerCount] = useState(0);
    const [image, setImage] = useState(null);
    const maxWidth = 1280;
    const maxHeight = 720;

    useEffect(() => {
        const cm = new CanvasManager('canvas-container');
        cm.onCanvasCreated = () => {
            setLayerCount(cm.canvases.length);
        };
        setCanvasManager(cm);
    }, []);

    return (
        <CanvasContext.Provider
            value={{
                canvasManager,
                setCanvasManager,
                activeCanvas,
                setActiveCanvas,
                activeIndex,
                setActiveIndex,
                setActiveTool,
                activeTool,
                image,
                setImage,
                maxWidth,
                maxHeight,
                setLayerCount,
                canvasRef,
                layerCount,
                selectionCanvas,
                setSelectionCanvas,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvasContext = () => useContext(CanvasContext);
