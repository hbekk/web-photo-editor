import { useState, useEffect } from 'react';

const useCanvasDrag = (activeCanvas, canvasContainerRef, activeTool) => {
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (activeCanvas && activeTool === "pointer") {
            const rect = activeCanvas.getBoundingClientRect();
            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setDragging(true);
        }
    };

    const handleMouseMove = (e) => {
        if (dragging && activeCanvas && activeTool === "pointer" ) {
            const containerRect = canvasContainerRef.current.getBoundingClientRect();
            const x = e.clientX - offset.x - containerRect.left;
            const y = e.clientY - offset.y - containerRect.top;

            activeCanvas.style.left = `${x}px`;
            activeCanvas.style.top = `${y}px`;
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (activeCanvas && !activeCanvas.isBase && activeTool === "pointer") {
            const container = canvasContainerRef.current;

            container.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                container.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [activeCanvas, dragging, offset, activeTool]);

    return { dragging, offset };
};

export default useCanvasDrag;
