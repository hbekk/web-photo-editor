class Filters {
    static gaussianBlur(canvas, ksize) {
            if (canvas.isTextLayer != true) {
                let src = window.cv.imread(canvas);
                let dst = new window.cv.Mat();
                let size = new window.cv.Size(9, 9);
                window.cv.GaussianBlur(src, dst, size, 0, 0, window.cv.BORDER_DEFAULT);
                window.cv.imshow(canvas, dst);
                src.delete(); dst.delete();
            } else {
                alert("Shape / Text elements cannot be filtered")
            }
            
    }

    static sobel(canvas) {
        if (canvas.isTextLayer != true) {
            let src = window.cv.imread(canvas);
            //let dst = new window.cv.Mat();
            let dstx = new window.cv.Mat();
            //let dsty = new window.cv.Mat();
            window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);
            // You can try more different parameters
            window.cv.Sobel(src, dstx, window.cv.CV_8U, 1, 0, 3, 1, 0, window.cv.BORDER_DEFAULT);
            //window.cv.Sobel(src, dsty, window.cv.CV_8U, 0, 1, 3, 1, 0, window.cv.BORDER_DEFAULT);
            window.cv.Scharr(src, dstx, window.cv.CV_8U, 1, 0, 1, 0, window.cv.BORDER_DEFAULT);
            // cv.Scharr(src, dsty, cv.CV_8U, 0, 1, 1, 0, cv.BORDER_DEFAULT);
            window.cv.imshow(canvas, dstx);
           // cv.imshow('canvasOutputy', dsty);
            src.delete(); dstx.delete();
        } else {
            alert("Shape / Text elements cannot be filtered")
        }
         
    }

    static binary(canvas) {
        if (canvas.isTextLayer != true) {
            let src = window.cv.imread(canvas);
            let dst = new window.cv.Mat();
            window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);
            let thresholdValue=127;
            window.cv.threshold(src,dst,thresholdValue,255,window.cv.THRESH_BINARY);
            window.cv.imshow(canvas, dst)
            src.delete();  dst.delete();
        } else {
            alert("Shape / Text elements cannot be filtered")
        }
    }
}

export default Filters;
