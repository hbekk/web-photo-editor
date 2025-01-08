import { useState, useEffect } from "react";

const useCanvasSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas, canvasScale = 1) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState(null);

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "selection") {
            const containerRect = canvasContainerRef.current.getBoundingClientRect();
            const canvasRect = activeCanvas.getBoundingClientRect();

            // Adjust mouse position relative to the container and canvas considering scale
            const offsetX = (e.clientX - canvasRect.left) / canvasScale;
            const offsetY = (e.clientY - canvasRect.top) / canvasScale;

            setSelection(null);
            setSelection({
                startX: offsetX,
                startY: offsetY,
                endX: null,
                endY: null,
            });
            setIsSelecting(true);

            if (!selectionCanvas) {
                const newCanvas = document.createElement("canvas");
                newCanvas.width = canvasRect.width / canvasScale;
                newCanvas.height = canvasRect.height / canvasScale;
                newCanvas.id = "selection-canvas";
                newCanvas.style.position = "absolute";
                newCanvas.style.top = `${canvasRect.top}px`;
                newCanvas.style.left = `${canvasRect.left}px`;
                newCanvas.style.pointerEvents = "none";
                newCanvas.style.zIndex = 1;
                document.body.appendChild(newCanvas);
                setSelectionCanvas(newCanvas);
            }
        }
    };

    const handleMouseMove = (e) => {
        if (!isSelecting || activeTool !== "selection") return;

        const canvasRect = activeCanvas.getBoundingClientRect();

        const currentX = (e.clientX - canvasRect.left) / canvasScale;
        const currentY = (e.clientY - canvasRect.top) / canvasScale;

        setSelection((prev) => ({
            ...prev,
            endX: currentX,
            endY: currentY,
        }));

        if (selectionCanvas) {
            const ctx = selectionCanvas.getContext("2d");
            ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);

            const width = Math.abs(currentX - selection.startX);
            const height = Math.abs(currentY - selection.startY);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(
                Math.min(currentX, selection.startX),
                Math.min(currentY, selection.startY),
                width,
                height
            );
        }
    };

    const handleMouseUp = () => {
        if (activeTool !== "selection") return;
        setIsSelecting(false);
        if (selection) {
            console.log("Selected Area:", selection);
        }
    };

    useEffect(() => {
        if (activeCanvas && activeTool === "selection") {
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
    }, [isSelecting, selection, activeCanvas, activeTool, canvasScale]);

    return { selection, setSelection, isSelecting };
};

export default useCanvasSelect;
