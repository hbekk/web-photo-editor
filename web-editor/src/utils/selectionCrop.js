// Crop function for rectangular selections
export const crop = (canvas, selection) => {
    if (selection == null) {
        alert("Please make selection first");
        return;
    }
    const { startX, startY, endX, endY } = selection;
    const dwidth = endX - startX;
    const dheight = endY - startY;

    const ctx = canvas.getContext('2d');
    const croppedImageData = ctx.getImageData(startX, startY, dwidth, dheight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.isCropped = true;
    canvas.width = dwidth;
    canvas.height = dheight;
    ctx.putImageData(croppedImageData, 0, 0);
};

// Crop function for polygonal selections
export const polyCrop = (canvas, polygonPoints) => {
    if (polygonPoints == null || polygonPoints.length < 3) {
        alert("Please make a valid polygon selection first.");
        return;
    }

    const { x, y, width, height } = getBoundingBox(polygonPoints);
    const ctx = canvas.getContext("2d");
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.translate(-x, -y);  // Translate so the polygon fits at (0,0)

    // Create the clipping path and apply it
    tempCtx.beginPath();
    tempCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for (let i = 1; i < polygonPoints.length; i++) {
        tempCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    tempCtx.closePath();
    tempCtx.clip();
    canvas.isCropped = true;

    // Draw the cropped image based on the polygon
    tempCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, x, y);
};

// Crop function for lasso selections
export const lassoCrop = (canvas, lassoPoints) => {
    if (lassoPoints.length < 3) {
        alert("Please make a selection first");
        return;
    }

    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    const { x, y, width, height } = getBoundingBox(lassoPoints);

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Create the clipping path for the lasso and apply it
    tempCtx.beginPath();
    tempCtx.moveTo(lassoPoints[0].x - x, lassoPoints[0].y - y);
    for (let i = 1; i < lassoPoints.length; i++) {
        tempCtx.lineTo(lassoPoints[i].x - x, lassoPoints[i].y - y);
    }
    tempCtx.closePath();
    tempCtx.clip();

    // Draw the cropped image based on the lasso
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    canvas.width = width;
    canvas.height = height;
    canvas.isCropped = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
};

export const getBoundingBox = (points) => {
    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};
