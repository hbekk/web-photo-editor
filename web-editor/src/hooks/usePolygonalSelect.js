import { useState, useEffect } from "react";

const usePolygonSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas) => {
    const [isPolygonSelecting, setIsPolygonSelecting] = useState(false);
    const [polygonPoints, setPolygonPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "poly-selection") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (isPolygonSelecting) {
                setPolygonPoints((prevPoints) => [...prevPoints, { x, y }]);
            } else {
                setPolygonPoints([{ x, y }]);
                setIsPolygonSelecting(true);
            }

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

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);

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

            if (polygonPoints.length > 0) {
                ctx.lineTo(currentX, currentY);
            }

            ctx.stroke();
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "poly-selection") return;

        if (polygonPoints.length > 2) {
            const startPoint = polygonPoints[0];
            const lastPoint = polygonPoints[polygonPoints.length - 1];
            const distance = Math.sqrt(
                Math.pow(lastPoint.x - startPoint.x, 2) + Math.pow(lastPoint.y - startPoint.y, 2)
            );
            if (distance < 10) {
                setPolygonPoints((prevPoints) => [...prevPoints, prevPoints[0]]);
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
