import { useState, useEffect } from "react";

const useCanvasSelect = (activeCanvas, canvasContainerRef, activeTool, setSelectionCanvas, selectionCanvas) => {
    const [isSelecting, setIsSelecting] = useState(false); // Tracks if a selection is in progress
    const [selection, setSelection] = useState(null); // Stores selection rectangle coordinates


    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "selection" ) {
            const rect = activeCanvas.getBoundingClientRect();
            setSelection(null);
            setSelection({
                startX: e.clientX - rect.left,
                startY: e.clientY - rect.top,
                endX: null,
                endY: null,
            });
            setIsSelecting(true);

            if (!selectionCanvas) {
                const newCanvas = document.createElement("canvas");
                newCanvas.width = rect.width;
                newCanvas.height = rect.height;
                newCanvas.id = "selection-canvas"
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
        if (!isSelecting || activeTool !== "selection") return;
        const rect = activeCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

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
            ctx.setLineDash([5, 5]); // Dashed line
            ctx.strokeRect(
                Math.min(currentX, selection.startX),  // Left
                Math.min(currentY, selection.startY),  // Top
                width, // Width
                height // Height
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
    }, [isSelecting, selection, activeCanvas, activeTool]);

    return { selection, isSelecting };
};

export default useCanvasSelect;
