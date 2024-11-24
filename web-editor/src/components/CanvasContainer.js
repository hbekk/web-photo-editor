import React, { useEffect } from 'react';
import { useCanvasContext } from '../context/CanvasProvider';

function CanvasContainer() {
    const {
        canvasManager,
        image,
        canvasRef,
        setActiveCanvas,
        setActiveIndex,
        activeTool,
        setHeight,
        setWidth,
    } = useCanvasContext();

    useEffect(() => {
        if (!canvasManager || !image) return;

        const img = new Image();
        img.src = image;

        img.onload = () => {
            const viewportWidth = window.innerWidth * 0.9;
            const viewportHeight = window.innerHeight * 0.9;

            const useOriginalSize = img.width <= viewportWidth && img.height <= viewportHeight;

            let newWidth = img.width;
            let newHeight = img.height;

            if (!useOriginalSize) {
                const widthRatio = viewportWidth / img.width;
                const heightRatio = viewportHeight / img.height;
                const scaleRatio = Math.min(widthRatio, heightRatio);

                newWidth = img.width * scaleRatio;
                newHeight = img.height * scaleRatio;
            }

            const existingCanvas = canvasManager.canvases.find(
                (canvas) => canvas.width === newWidth && canvas.height === newHeight
            );

            if (existingCanvas) {
                setActiveCanvas(existingCanvas);
                setActiveIndex(canvasManager.canvases.indexOf(existingCanvas));
                return;
            }
            canvasManager.createCanvas(newWidth, newHeight);
            const newCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
            newCanvas.width = newWidth;
            newCanvas.height = newHeight;
            newCanvas.isBase = true;

            setHeight(newCanvas.height);
            setWidth(newCanvas.width);

            setActiveCanvas(newCanvas);
            setActiveIndex(canvasManager.canvases.length - 1);

            const ctx = newCanvas.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
        };

        img.onerror = () => {
            console.error("Failed to load image");
        };
    }, [image, canvasManager, setHeight, setWidth, setActiveCanvas, setActiveIndex]);

    return (
        <div className="canvas-container" id="canvas-container" ref={canvasRef}
             style={{ cursor: activeTool === "selection" ? "crosshair" : "default" }}>
        </div>
    );
}

export default CanvasContainer;
