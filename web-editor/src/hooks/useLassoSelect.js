import { useState, useEffect } from "react";

const useLassoSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas) => {
    const [isLassoSelecting, setIsLassoSelecting] = useState(false); // Track if selection is in progress
    const [lassoPoints, setLassoPoints] = useState([]); // Track points of the lasso path

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "lasso-selection") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Start a new lasso selection
            setLassoPoints([{ x, y }]);
            setIsLassoSelecting(true);

            // Initialize selection canvas if not already present
            if (!selectionCanvas) {
                const newCanvas = document.createElement("canvas");
                newCanvas.width = rect.width;
                newCanvas.height = rect.height;
                newCanvas.id = "selection-canvas";
                newCanvas.style.position = "absolute";
                newCanvas.style.top = `${rect.top}px`;
                newCanvas.style.left = `${rect.left}px`;
                newCanvas.style.pointerEvents = "none";
                newCanvas.style.zIndex = 1;
                document.body.appendChild(newCanvas);
                setSelectionCanvas(newCanvas);
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!isLassoSelecting || activeTool !== "lasso-selection") return;
        const rect = activeCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Add the current mouse position to the lasso path
        setLassoPoints((prevPoints) => [...prevPoints, { x: currentX, y: currentY }]);

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Clear canvas

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.setLineDash([]); // Solid line for lasso selection

            ctx.beginPath();
            lassoPoints.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });

            // Draw the current "edge" as the user moves the mouse
            ctx.lineTo(currentX, currentY); // Connect to the current mouse position

            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "lasso-selection") return;

        // Optionally close the lasso if the last point is near the first one
        const startPoint = lassoPoints[0];
        const lastPoint = lassoPoints[lassoPoints.length - 1];
        const distance = Math.sqrt(
            Math.pow(lastPoint.x - startPoint.x, 2) + Math.pow(lastPoint.y - startPoint.y, 2)
        );
        if (distance < 10) {
            setLassoPoints((prevPoints) => [...prevPoints, prevPoints[0]]); // Close the lasso
            setIsLassoSelecting(false);
            console.log("Lasso closed:", lassoPoints);
        }
    };

    useEffect(() => {
        if (activeCanvas && activeTool === "lasso-selection") {
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
    }, [isLassoSelecting, lassoPoints, activeCanvas, activeTool]);

    return { lassoPoints, setLassoPoints, isLassoSelecting };
};

export default useLassoSelect;
