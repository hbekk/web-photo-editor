// App.js
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Navbar } from './js/navbar';
import { Toolbar, sizeUpText } from './js/toolbar';
import { Layers } from './js/layers';
import { CanvasManager } from './js/layers';

function App() {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [canvasManager, setCanvasManager] = useState(null);
    const maxWidth = window.innerWidth * 0.6; 
    const maxHeight = window.innerHeight * 0.6;
    const [layerCount, setLayerCount] = useState(0);
    const [activeCanvas, setActiveCanvas] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);


    useEffect(() => {
        const cm = new CanvasManager('canvas-container');
        cm.onCanvasCreated = () => {
            setLayerCount(cm.canvases.length); 
        };
        setCanvasManager(cm);
    }, []);

    useEffect(() => {
      if (!canvasManager) return;

      canvasManager.createCanvas(maxWidth, maxHeight);

      const latestCanvas = canvasManager.canvases[canvasManager.canvases.length - 1]

      if (!latestCanvas) {  
        console.error("Canvas not created successfully.");
        return;
      }

      setActiveCanvas(latestCanvas);
      setActiveIndex(canvasManager.canvases.length - 1)

      const ctx = latestCanvas.getContext("2d");

      if (image) {
        const img = new Image();
        img.src = image;

        img.onload = () => {
          const aspectRatio = img.width / img.height;

          if (img.width > maxWidth || img.height > maxHeight) {
            if (aspectRatio > 1) {
              latestCanvas.width = maxWidth;
              latestCanvas.height = maxWidth / aspectRatio;
            } else {
              latestCanvas.height = maxHeight;
              latestCanvas.width = maxHeight * aspectRatio;
            }
          } else {
            latestCanvas.width = img.width;
            latestCanvas.height = img.height;
          }
          ctx.drawImage(img, 0, 0, latestCanvas.width, latestCanvas.height);
        };
      }
    }, [image, canvasManager]);

    return (
        <>
            <Navbar 
            setImage={setImage}
            activeCanvas={activeCanvas}
             />
            <sizeUpText

            />
            <Layers canvasManager={canvasManager} setActiveCanvas={setActiveCanvas} activeIndex={activeIndex} setActiveIndex={setActiveIndex}/> 
            <Toolbar 
                    canvasManager={canvasManager}
                    setActiveIndex={setActiveIndex}
                    setActiveCanvas={setActiveCanvas}
                    activeCanvas={activeCanvas}
                />
            <div className="canvas-container" id="canvas-container" ref={canvasRef}></div>
        </>
    );
}

export default App;
