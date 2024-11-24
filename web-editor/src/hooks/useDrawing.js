import { useState, useEffect } from "react";

const useDrawing = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas, brushColor, brushSize, drawPattern) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "brush") {
            const rect = activeCanvas.getBoundingClientRect();
            const scaleX = activeCanvas.width / rect.width;
            const scaleY = activeCanvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            setDrawingPoints([{ x, y }]);
            setIsDrawing(true);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || activeTool !== "brush") return;

        const rect = activeCanvas.getBoundingClientRect();
        const scaleX = activeCanvas.width / rect.width;
        const scaleY = activeCanvas.height / rect.height;

        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;

        setDrawingPoints((prevPoints) => [...prevPoints, { x: currentX, y: currentY }]);

        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1.0;

            if (drawPattern === "Spray") {
                for (let i = 0; i < 20; i++) {
                    const offsetX = (Math.random() - 0.5) * brushSize; // Random X offset
                    const offsetY = (Math.random() - 0.5) * brushSize; // Random Y offset
                    const radius = Math.random() * (brushSize / 4); // Random particle size

                    ctx.beginPath();
                    ctx.arc(currentX + offsetX, currentY + offsetY, radius, 0, Math.PI * 2);
                    ctx.fillStyle = brushColor;
                    ctx.fill();
                }
            }

            if (drawPattern === "Square") {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;

                ctx.beginPath();
                drawingPoints.forEach((point, index) => {
                    if (index === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
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
