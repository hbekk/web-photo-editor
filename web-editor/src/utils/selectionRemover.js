export const selectionRemover = (setSelectionCanvas, setSelection) => {
    let selectionCanvasTemp = document.getElementById("selection-canvas");
    if (selectionCanvasTemp) {
        document.body.removeChild(selectionCanvasTemp);
        setSelectionCanvas(null);
        setSelection(null);
    }
};

export const polySelectionRemover = (setSelectionCanvas, setPolygonPoints) => {
    let selectionCanvasTemp = document.getElementById("selection-canvas");
    if (selectionCanvasTemp) {
        document.body.removeChild(selectionCanvasTemp);
        setSelectionCanvas(null);
        setPolygonPoints([]);
    }
};