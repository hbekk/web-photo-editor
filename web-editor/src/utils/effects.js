class Filters {
    static gaussianBlur(canvas, ksize) {
        if (!this.editableChecker(canvas)) return;
        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();
        let size = new window.cv.Size(9, 9);
        window.cv.GaussianBlur(src, dst, size, 0, 0, window.cv.BORDER_DEFAULT);
        window.cv.imshow(canvas, dst);
        src.delete(); dst.delete();
    }

    static sobelx(canvas) {
        if (!this.editableChecker(canvas)) return;
        let src = window.cv.imread(canvas);
        let dstx = new window.cv.Mat();
        window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);
        window.cv.Sobel(src, dstx, window.cv.CV_8U, 1, 0, 3, 1, 0, window.cv.BORDER_DEFAULT);
        window.cv.imshow(canvas, dstx);
        src.delete(); dstx.delete();
    }

    static sobely(canvas) {
        if (!this.editableChecker(canvas)) return;
        let src = window.cv.imread(canvas);
        let dsty = new window.cv.Mat();
        window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);
        window.cv.Sobel(src, dsty, window.cv.CV_8U, 0, 1, 3, 1, 0, window.cv.BORDER_DEFAULT);
        window.cv.imshow(canvas, dsty);
        src.delete(); dsty.delete();

    }

    static binary(canvas) {
        if (!this.editableChecker(canvas)) return;
        let src = window.cv.imread(canvas);
        let dst = new window.cv.Mat();
        window.cv.cvtColor(src, src, window.cv.COLOR_RGB2GRAY, 0);
        let thresholdValue=127;
        window.cv.threshold(src,dst,thresholdValue,255,window.cv.THRESH_BINARY);
        window.cv.imshow(canvas, dst);
        src.delete();
        dst.delete();

    }

    static editableChecker(canvas) {
        if (canvas.isTextLayer) {
            alert("Text elements cannot be filtered");
            return false;
        }

        if (canvas.isCropped) {
            alert("You cannot filter cropped images, please use filter first");
            return false;
        }

        if (canvas.isShapeLayer) {
            alert("Shape elements cannot be filtered");
            return false;
        }

        return true;
    }
}

export default Filters;
