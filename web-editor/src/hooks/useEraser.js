import { useState, useEffect } from "react";

const useEraser = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas, brushSize) => {
    const [isErasing, setIsErasing] = useState(false);
    const [erasingPoints, setErasingPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "eraser") {
            const rect = activeCanvas.getBoundingClientRect();
            const scaleX = activeCanvas.width / rect.width;
            const scaleY = activeCanvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            setErasingPoints([{ x, y }]);
            setIsErasing(true);
        }
    };

    const handleMouseMove = (e) => {
        if (!isErasing || activeTool !== "eraser") return;
        const rect = activeCanvas.getBoundingClientRect();
        const scaleX = activeCanvas.width / rect.width;
        const scaleY = activeCanvas.height / rect.height;

        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;

        setErasingPoints((prevPoints) => [...prevPoints, { x: currentX, y: currentY }]);

        if (activeCanvas) {
            const ctx = activeCanvas.getContext("2d");

            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = brushSize;

            ctx.beginPath();
            erasingPoints.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "eraser") return;
        setIsErasing(false);
        setErasingPoints([]);
    };

    useEffect(() => {
        if (activeCanvas && activeTool === "eraser") {
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
    }, [isErasing, erasingPoints, activeCanvas, activeTool]);

    return { isErasing };
};

export default useEraser;
