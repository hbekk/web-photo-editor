import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CanvasManager } from '../components/layers';
import useCanvasSelect from "../hooks/useCanvasSelect";
import useCanvasDrag from "../hooks/useCanvasDrag";
import usePolygonalSelect from "../hooks/usePolygonalSelect";
import useLassoSelect from "../hooks/useLassoSelect";
import useDrawing from "../hooks/useDrawing";
import useEraser from "../hooks/useEraser";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
    const [canvasManager, setCanvasManager] = useState(null);
    const canvasRef = useRef(null);
    const [activeCanvas, setActiveCanvas] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTool, setActiveTool] = useState("pointer");
    const [selectionCanvas, setSelectionCanvas] = useState(null); // Store the selection canvas
    const [layerCount, setLayerCount] = useState(0);
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [maxWidth, setWidth] = useState(0);
    const [maxHeight, setHeight] = useState(0);
    const [BG, setBG] = useState("transparent");

    const [brushSize, setBrushSize] = useState(10);
    const [brushColor, setBrushColor] = useState("#ffffff");
    const [drawPattern, setDrawPattern] = useState("Spray");
    const [shapeColor, setShapeColor] = useState("#ffffff");
    const [shapeOutlineColor, setShapeOutlineColor] = useState("#000000");


    const { selection, setSelection, isSelecting } = useCanvasSelect(activeCanvas, canvasRef, activeTool, setSelectionCanvas, selectionCanvas);
    const { polygonPoints, setPolygonPoints, isPolygonSelecting } = usePolygonalSelect(activeCanvas, canvasRef, activeTool, setSelectionCanvas, selectionCanvas);
    const {lassoPoints, setLassoPoints } = useLassoSelect(activeCanvas, canvasRef, activeTool, setSelectionCanvas, selectionCanvas);
    const { dragging } = useCanvasDrag(activeCanvas, canvasRef, activeTool);
    const { drawing } = useDrawing(activeCanvas, canvasRef, activeTool, setSelectionCanvas, selectionCanvas, brushColor, brushSize, drawPattern);
    const { erasing } = useEraser(activeCanvas, canvasRef, activeTool, setSelectionCanvas, selectionCanvas, brushSize);





    useEffect(() => {
        const cm = new CanvasManager('canvas-container');
        cm.onCanvasCreated = () => {
            setLayerCount(cm.canvases.length);
        };
        setCanvasManager(cm);
    }, []);

    return (
        <CanvasContext.Provider
            value={{
                canvasManager,
                setCanvasManager,
                activeCanvas,
                setActiveCanvas,
                activeIndex,
                setActiveIndex,
                setActiveTool,
                activeTool,
                image,
                setImage,
                maxWidth,
                maxHeight,
                setLayerCount,
                canvasRef,
                layerCount,
                selectionCanvas,
                setSelectionCanvas,
                selection,
                setSelection,
                polygonPoints,
                setPolygonPoints,
                isPolygonSelecting,
                lassoPoints,
                setLassoPoints,
                setBrushColor,
                setBrushSize,
                brushSize,
                brushColor,
                drawPattern,
                setDrawPattern,
                modalVisible, setModalVisible,
                modalContent, setModalContent,
                shapeColor,
                setShapeColor,
                shapeOutlineColor,
                setShapeOutlineColor,
                setHeight,
                setWidth,
                BG,
                setBG,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvasContext = () => useContext(CanvasContext);
