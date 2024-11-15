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
    const maxHeight = 720;
    const maxWidth = 1280; 
    const [layerCount, setLayerCount] = useState(0);
    const [activeCanvas, setActiveCanvas] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });


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
      canvasManager.canvases[0].isBase = true;

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

    const handleMouseDown = (e) => {
      if (activeCanvas) {
          const rect = activeCanvas.getBoundingClientRect();
          setOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
          });
          setDragging(true);
      }
  };

  const handleMouseMove = (e) => {
      if (dragging && activeCanvas) {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = e.clientX - offset.x - rect.left;
          const y = e.clientY - offset.y - rect.top;

          activeCanvas.style.left = `${x}px`;
          activeCanvas.style.top = `${y}px`;
      }
  };

  const handleMouseUp = () => {
      setDragging(false);
  };

  useEffect(() => {
      if (activeCanvas) {

        if (activeCanvas.isBase == false) {
          const container = canvasRef.current;

          container.addEventListener('mousedown', handleMouseDown);
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);

          return () => {
              container.removeEventListener('mousedown', handleMouseDown);
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
          };
        }
          
      }
  }, [activeCanvas, dragging, offset]);

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
