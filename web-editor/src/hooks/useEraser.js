import { useState, useEffect } from "react";

const useEraser = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas, brushSize) => {
    const [isErasing, setIsErasing] = useState(false);
    const [erasingPoints, setErasingPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "eraser") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setErasingPoints([{ x, y }]);
            setIsErasing(true);
            setSelectionCanvas(activeCanvas);
        }
    };

    const handleMouseMove = (e) => {
        if (!isErasing || activeTool !== "eraser") return;
        const rect = activeCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Add the current mouse position to the lasso path
        setErasingPoints((prevPoints) => [...prevPoints, { x: currentX, y: currentY }]);

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.beginPath();
            ctx.globalCompositeOperation="destination-out";
            ctx.lineWidth = brushSize;

            ctx.beginPath();
            erasingPoints.forEach((point,) => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "eraser") return;
        setIsErasing(false);
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

    return {isErasing: isErasing };
};

export default useEraser;
