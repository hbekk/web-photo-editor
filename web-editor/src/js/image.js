class ImageEffects {

    static rotatecw = (canvas, direction) => {
        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();
        window.cv.rotate(src, dst, window.cv.ROTATE_90_CLOCKWISE);
        window.cv.imshow(canvas, dst);
        src.delete();
        dst.delete();
      }

    static rotateccw = (canvas, direction) => {
        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();
        window.cv.rotate(src, dst, window.cv.ROTATE_90_COUNTERCLOCKWISE);
        window.cv.imshow(canvas, dst);
        src.delete();
        dst.delete();
      }

    static flipHorisontally = (canvas) => {
        const src = window.cv.imread(canvas); 
        const dst = new window.cv.Mat(); 
    
        window.cv.flip(src, dst, 1);        
        window.cv.imshow(canvas, dst);

        src.delete();
        dst.delete();
    }

    static flipVertically = (canvas) => {
        const src = window.cv.imread(canvas); 
        const dst = new window.cv.Mat(); 
    
        window.cv.flip(src, dst, 0);        
        window.cv.imshow(canvas, dst);

        src.delete();
        dst.delete();

    }
}


export default ImageEffects;