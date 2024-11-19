import { useState, useEffect } from "react";

const usePolygonSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas) => {
    const [isPolygonSelecting, setIsPolygonSelecting] = useState(false); // Track if selection is in progress
    const [polygonPoints, setPolygonPoints] = useState([]); // Track points of the polygon

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "poly-selection") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // If polygon selection is in progress, add a new point
            if (isPolygonSelecting) {
                setPolygonPoints((prevPoints) => [...prevPoints, { x, y }]);
            } else {
                // Start a new polygon selection
                setPolygonPoints([{ x, y }]);
                setIsPolygonSelecting(true);
            }

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
        if (!isPolygonSelecting || activeTool !== "poly-selection") return;
        const rect = activeCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // If there's an active selection, we are in the process of selecting points
        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Clear canvas

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            ctx.beginPath();
            polygonPoints.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });

            // Draw the current "edge" as the user moves the mouse
            if (polygonPoints.length > 0) {
                ctx.lineTo(currentX, currentY); // Connect to the current mouse position
            }

            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "poly-selection") return;

        // Optionally close the polygon if the last point is near the first one
        if (polygonPoints.length > 2) {
            const startPoint = polygonPoints[0];
            const lastPoint = polygonPoints[polygonPoints.length - 1];
            const distance = Math.sqrt(
                Math.pow(lastPoint.x - startPoint.x, 2) + Math.pow(lastPoint.y - startPoint.y, 2)
            );
            if (distance < 10) {
                setPolygonPoints((prevPoints) => [...prevPoints, prevPoints[0]]); // Close the polygon
                setIsPolygonSelecting(false);
                console.log("Polygon closed:", polygonPoints);
            }
        }
    };

    useEffect(() => {
        if (activeCanvas && activeTool === "poly-selection") {
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
    }, [isPolygonSelecting, polygonPoints, activeCanvas, activeTool]);

    return { polygonPoints, setPolygonPoints, isPolygonSelecting };
};

export default usePolygonSelect;
