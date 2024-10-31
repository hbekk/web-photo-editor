import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Navbar } from './js/navbar';
import { Toolbar } from './js/toolbar';
import { Layers } from './js/layers';
import { CanvasManager } from './js/layers';

function App() {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [canvasManager, setCanvasManager] = useState(null);
    const maxWidth = window.innerWidth * 0.6; 
    const maxHeight = window.innerHeight * 0.6;
    const [layerCount, setLayerCount] = useState(0);

    useEffect(() => {
        const cm = new CanvasManager('canvas-container');

        cm.onCanvasCreated = () => {
          setLayerCount(cm.canvases.length); 
      };
        setCanvasManager(cm);
    }, []);

    useEffect(() => {
      if (!canvasManager) return;
  
      const maxWidth = window.innerWidth * 0.6; 
      const maxHeight = window.innerHeight * 0.6;
  
      canvasManager.createCanvas(maxWidth, maxHeight);
  
      const lastCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
      const ctx = lastCanvas.getContext("2d");
  
      if (image) {
        const img = new Image();
        img.src = image;
  
        img.onload = () => {
          const aspectRatio = img.width / img.height;
  
          if (img.width > maxWidth || img.height > maxHeight) {
            if (aspectRatio > 1) {
              lastCanvas.width = maxWidth;
              lastCanvas.height = maxWidth / aspectRatio;
            } else {
              lastCanvas.height = maxHeight;
              lastCanvas.width = maxHeight * aspectRatio;
            }
          } else {
            lastCanvas.width = img.width;
            lastCanvas.height = img.height;
          }
          ctx.drawImage(img, 0, 0, lastCanvas.width, lastCanvas.height);
        };
      }
    }, [image, canvasManager]); // Depend on image and canvasManager

    return (
        <>
            <Navbar setImage={setImage} canvasRef={canvasRef} />
            <Layers  canvasManager={canvasManager} /> 
            <Toolbar />
            <div className="canvas-container" id="canvas-container" ref={canvasRef}>
                <h2>Please create a new image, or import one.</h2>
            </div>
        </>
    );
}

export default App;
