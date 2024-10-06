import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Navbar } from './js/navbar';
import { Toolbar } from './js/toolbar';

function App() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const gaussianBlur = (canvas) => {
    let src = window.cv.imread(canvas);
    let dst = new window.cv.Mat();
    let ksize = new window.cv.Size(9, 9);
    window.cv.GaussianBlur(src, dst, ksize, 0, 0, window.cv.BORDER_DEFAULT);
    window.cv.imshow(canvas, dst);
    src.delete(); dst.delete();
  }

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
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      };
     
    }
  }, [image]);


  

  
  return (
    <>
    <Navbar 
    setImage={setImage}
    gaussianBlur={gaussianBlur}
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
 