import { useState, useEffect } from "react";

const useLassoSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas) => {
    const [isLassoSelecting, setIsLassoSelecting] = useState(false);
    const [lassoPoints, setLassoPoints] = useState([]);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "lasso-selection") {
            const rect = activeCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setLassoPoints([{ x, y }]);
            setIsLassoSelecting(true);

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

        const updatedPoints = [...lassoPoints, { x: currentX, y: currentY }];
        setLassoPoints(updatedPoints);

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.setLineDash([]);

            ctx.beginPath();
            updatedPoints.forEach((point, index) => {
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
        if (activeTool !== "lasso-selection") return;

        if (lassoPoints.length < 2) {
            return;
        }
        const startPoint = lassoPoints[0];
        const lastPoint = lassoPoints[lassoPoints.length - 1];
        const distance = Math.sqrt(
            Math.pow(lastPoint.x - startPoint.x, 2) + Math.pow(lastPoint.y - startPoint.y, 2)
        );

        if (distance < 10) {
            setLassoPoints((prevPoints) => [...prevPoints, prevPoints[0]]);
            setIsLassoSelecting(false);
            console.log("Lasso closed:", lassoPoints);
        } else {
            setIsLassoSelecting(false);
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
