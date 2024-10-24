import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './App.css';
import { Navbar } from './js/navbar';
import { Toolbar } from './js/toolbar';



function App() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const rotate = (canvas) => {
    let src = window.cv.imread(canvas);
    let dst = new window.cv.Mat();
    window.cv.rotate(src, dst, window.cv.ROTATE_90_CLOCKWISE);
    window.cv.imshow(canvas, dst);
    src.delete();
    dst.delete();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (image) {
      const img = new Image();
      img.src = image;
  
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.7; 
        const maxHeight = window.innerHeight * 0.7;
        const aspectRatio = img.width / img.height;

        if (img.width > maxWidth || img.height > maxHeight) {
            if (aspectRatio > 1) {
                canvas.width = maxWidth;
                canvas.height = maxWidth / aspectRatio;
            } else {
                canvas.height = maxHeight;
                canvas.width = maxHeight * aspectRatio;
            }
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
     
    }
  }, [image]);


  

  
  return (
    <>
    <Navbar 
    setImage={setImage}
    rotate={rotate}
    canvasRef={canvasRef}
    />
    <Toolbar/>
    <div className="canvas-container">
    <canvas
          id="canvas"
          ref={canvasRef}
          className="myCanvas"
        ></canvas>

    </div>


    </>
  );
 
}

export default App;
 