import { useState, useEffect } from "react";

const useDrawing = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas, brushColor, brushSize, drawPattern) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "brush") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setDrawingPoints([{ x, y }]);
            setIsDrawing(true);
            setSelectionCanvas(activeCanvas);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || activeTool !== "brush") return;
        const rect = activeCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Add the current mouse position to the lasso path
        setDrawingPoints((prevPoints) => [...prevPoints, { x: currentX, y: currentY }]);

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");

            if (drawPattern === "Spray") {
                const offsetX = Math.random() * brushSize - brushSize / 2; // Random X offset
                const offsetY = Math.random() * brushSize  - brushSize/ 2; // Random Y offset

                ctx.beginPath();
                ctx.arc(currentX + offsetX, currentY + offsetY, Math.random() * brushSize / 2, 0, Math.PI * 2);
                ctx.fillStyle = brushColor;
                ctx.fill();
            }

            // If Brush (or any other pattern) is selected
            if (drawPattern === "Square") {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;

                ctx.beginPath();
                drawingPoints.forEach((point, index) => {
                    ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            }
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "brush") return;
        setIsDrawing(false);
    };

    useEffect(() => {
        if (activeCanvas && activeTool === "brush") {
            const container = canvasContainerRef.current;
            if (container) {
                container.addEventListener("mousedown", handleMouseDown);
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);

                return () => {
                    container.removeEventListener("mousedown", handleMouseDown);
                    window.removeEventListener("mousemove", handleMouseMove);
                    window.removeEventListener("mouseup", handleMouseUp);
                };
            }
        }
    }, [isDrawing, drawingPoints, activeCanvas, activeTool]);

    return {isDrawing: isDrawing };
};

export default useDrawing;
