import React, { useEffect } from 'react';
import { useCanvasContext } from '../context/CanvasProvider';
import useCanvasDrag from "../hooks/useCanvasDrag";
import useCanvasSelect from "../hooks/useCanvasSelect";


function CanvasContainer() {
    const { canvasManager,
            image,
            maxWidth,
            maxHeight, canvasRef,
            setActiveCanvas,
            setActiveIndex,
            activeTool,
            } = useCanvasContext();


    useEffect(() => {
        if (!canvasManager) return;
        if (activeTool === "selection") {
            alert("Please finish selection before creating a new layer");
            return;
        }
        canvasManager.createCanvas(maxWidth, maxHeight);
        canvasManager.canvases[0].isBase = true;

        const latestCanvas = canvasManager.canvases[canvasManager.canvases.length - 1]

        if (!latestCanvas) {
            console.error("Canvas not created successfully.");
            return;
        }

        setActiveCanvas(latestCanvas);
        setActiveIndex(canvasManager.canvases.length - 1)

        const ctx = latestCanvas.getContext("2d");

        if (image) {
            const img = new Image();
            img.src = image;

            img.onload = () => {
                const aspectRatio = img.width / img.height;

                if (img.width > maxWidth || img.height > maxHeight) {
                    if (aspectRatio > 1) {
                        latestCanvas.width = maxWidth;
                        latestCanvas.height = maxWidth / aspectRatio;
                    } else {
                        latestCanvas.height = maxHeight;
                        latestCanvas.width = maxHeight * aspectRatio;
                    }
                } else {
                    latestCanvas.width = img.width;
                    latestCanvas.height = img.height;
                }
                ctx.drawImage(img, 0, 0, latestCanvas.width, latestCanvas.height);
            };
        }
    }, [image, canvasManager]);
    return (
        <div className="canvas-container" id="canvas-container" ref={canvasRef}
             style={{ cursor: activeTool === "selection" ? "crosshair" : "default" }}>
        </div>
    )
        ;
}

export default CanvasContainer;
