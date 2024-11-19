export const rectangleCut = (canvas, selection, canvasManager) => {
    if (selection == null) {
        alert("Please make a selection first.");
        return;
    }

    const { startX, startY, endX, endY } = selection;
    const dwidth = endX - startX;
    const dheight = endY - startY;

    const ctx = canvas.getContext('2d');
    const croppedImageData = ctx.getImageData(startX, startY, dwidth, dheight);

    // Create a new canvas for the copied content
    canvasManager.createCanvas(dwidth, dheight);
    const copyCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
    const copyCtx = copyCanvas.getContext('2d');

    // Put the copied data onto the new canvas
    copyCtx.putImageData(croppedImageData, 0, 0);

    // Clear the selected area on the original canvas
    ctx.clearRect(startX, startY, dwidth, dheight);

    // Mark the copied canvas as cropped
    copyCanvas.isCropped = true;
};

export const polygonalCut = (canvas, polygonPoints, canvasManager) => {
    if (polygonPoints == null || polygonPoints.length < 3) {
        alert("Please make a valid polygon selection first.");
        return;
    }

    const ctx = canvas.getContext("2d");

    // Create a temporary canvas to handle the clipping
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Get the bounding box for the polygon
    const boundingBox = getBoundingBox(polygonPoints);
    const { x, y, width, height } = boundingBox;

    // Set the temporary canvas size to the bounding box dimensions
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Translate the context to the bounding box origin
    tempCtx.translate(-x, -y);

    // Begin the clipping path
    tempCtx.beginPath();
    tempCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    polygonPoints.forEach(point => tempCtx.lineTo(point.x, point.y));
    tempCtx.closePath();
    tempCtx.clip();

    // Draw the original image onto the temporary canvas with the polygon clip
    tempCtx.drawImage(canvas, 0, 0);

    // Create a new canvas for the copied content
    canvasManager.createCanvas(width, height);
    const copyCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
    const copyCtx = copyCanvas.getContext('2d');

    // Draw the clipped content from tempCanvas onto the new canvas
    copyCtx.drawImage(tempCanvas, 0, 0);

    // Clear the selected area (clipped polygon area) on the original canvas
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    polygonPoints.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.clip();
    ctx.clearRect(x, y, width, height);
    ctx.restore();

    // Mark the copied canvas as cropped
    copyCanvas.isCropped = true;
};

export const lassoCut = (canvas, lassoPoints, canvasManager) => {
    if (lassoPoints == null || lassoPoints.length < 3) {
        alert("Please make a valid lasso selection first.");
        return;
    }

    const ctx = canvas.getContext("2d");

    // Create a temporary canvas to handle the lasso clipping
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Get the bounding box for the lasso
    const minX = Math.min(...lassoPoints.map(p => p.x));
    const maxX = Math.max(...lassoPoints.map(p => p.x));
    const minY = Math.min(...lassoPoints.map(p => p.y));
    const maxY = Math.max(...lassoPoints.map(p => p.y));

    const dwidth = maxX - minX;
    const dheight = maxY - minY;

    // Set the temporary canvas size to the bounding box dimensions
    tempCanvas.width = dwidth;
    tempCanvas.height = dheight;

    // Begin the clipping path for the lasso
    tempCtx.beginPath();
    lassoPoints.forEach((point, index) => {
        if (index === 0) {
            tempCtx.moveTo(point.x - minX, point.y - minY);
        } else {
            tempCtx.lineTo(point.x - minX, point.y - minY);
        }
    });
    tempCtx.closePath();
    tempCtx.clip();

    // Draw the original canvas onto the temporary canvas, clipped by the lasso
    tempCtx.drawImage(canvas, minX, minY, dwidth, dheight, 0, 0, dwidth, dheight);

    // Create a new canvas for the copied content
    canvasManager.createCanvas(dwidth, dheight);
    const copyCanvas = canvasManager.canvases[canvasManager.canvases.length - 1];
    const copyCtx = copyCanvas.getContext('2d');

    // Draw the clipped content from tempCanvas onto the new canvas
    copyCtx.drawImage(tempCanvas, 0, 0);

    // Clear the selected area (clipped lasso area) on the original canvas
    ctx.save();
    ctx.beginPath();
    lassoPoints.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.closePath();
    ctx.clip();
    ctx.clearRect(minX, minY, dwidth, dheight);
    ctx.restore();

    // Mark the copied canvas as cropped
    copyCanvas.isCropped = true;
};

export const getBoundingBox = (points) => {
    let minX = Math.min(...points.map(p => p.x));
    let minY = Math.min(...points.map(p => p.y));
    let maxX = Math.max(...points.map(p => p.x));
    let maxY = Math.max(...points.map(p => p.y));

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
};