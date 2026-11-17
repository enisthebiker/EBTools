
const $ = id => document.getElementById(id);

const translations = {
    tr: {
        title: "Döndürme ve Aynalama",
        subtitle: "Görsellerini döndür, aynala ve istediğin yönde düzenle. İşlemler cihazında yapılır.",
        choose: "Görsel seçmek için tıkla",
        supported: "PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, SVG, BMP, GIF ve ICO",
        rotate: "Döndürme",
        flip: "Aynalama",
        left: "Sola 90°",
        right: "Sağa 90°",
        horizontal: "Yatay Aynala",
        vertical: "Dikey Aynala",
        reset: "Orijinal Hâline Döndür",
        download: "Görseli İndir",
        footer: "EBTools · Ücretsiz çevrimiçi araçlar",
        home: "Ana sayfa",
        previous: "← Önceki Sayfa",
        loaded: "Görsel yüklendi.",
        resetDone: "Görsel orijinal hâline döndürüldü.",
        downloadDone: "Görsel indirildi.",
        invalid: "Bu görsel formatı desteklenmiyor.",
        loadError: "Görsel açılamadı. Başka bir dosya deneyin.",
        avifError: "AVIF görseli çözülemedi.",
        heicError: "HEIC/HEIF görseli çözülemedi.",
        tiffError: "TIFF/TIF görseli açılamadı.",
        heicWarning: "HEIC/HEIF dosyası açılırken yüksek bellek kullanılabilir. Devam etmek istiyor musunuz?",
        largeWarning: "Bu görsel çok büyük. İşlem sırasında tarayıcı yavaşlayabilir. Devam etmek istiyor musunuz?",
        tiffWarning: "Bu TIFF görseli çok büyük ({width} × {height} piksel). Devam etmek istiyor musunuz?",
        svgError: "SVG görseli açılamadı veya ölçüleri belirlenemedi.",
        encodingError: "Görsel kaydedilemedi. Lütfen tekrar deneyin.",
        ready: "İşlem tamamlandı."
    },
    en: {
        title: "Rotate and Flip",
        subtitle: "Rotate, flip and adjust your images in any direction. Processing happens on your device.",
        choose: "Click to select an image",
        supported: "PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, SVG, BMP, GIF and ICO",
        rotate: "Rotate",
        flip: "Flip",
        left: "Rotate Left 90°",
        right: "Rotate Right 90°",
        horizontal: "Flip Horizontal",
        vertical: "Flip Vertical",
        reset: "Reset to Original",
        download: "Download Image",
        footer: "EBTools · Free online tools",
        home: "Home",
        previous: "← Previous Page",
        loaded: "Image loaded.",
        resetDone: "Image restored to its original state.",
        downloadDone: "Image downloaded.",
        invalid: "This image format is not supported.",
        loadError: "Could not open the image. Try another file.",
        avifError: "The AVIF image could not be decoded.",
        heicError: "The HEIC/HEIF image could not be decoded.",
        tiffError: "The TIFF/TIF image could not be opened.",
        heicWarning: "Opening HEIC/HEIF may use substantial memory. Continue?",
        largeWarning: "This image is very large. Your browser may slow down during processing. Continue?",
        tiffWarning: "This TIFF image is very large ({width} × {height} pixels). Continue?",
        svgError: "The SVG image could not be opened or its dimensions could not be determined.",
        encodingError: "The image could not be saved. Please try again.",
        ready: "Operation completed."
    }
};

let language = "tr";
let originalImage = null;
let currentFile = null;
let originalUrl = null;
let rotation = 0;
let flipHorizontal = false;
let flipVertical = false;
let svgSource = null;

const buttons = [
    $("rotateLeftButton"),
    $("rotateRightButton"),
    $("flipHorizontalButton"),
    $("flipVerticalButton"),
    $("resetButton"),
    $("downloadButton")
];

// --------------------------------------------------
// Worker bağlantıları
// Converter klasöründeki mevcut Worker dosyalarını kullanır.
// --------------------------------------------------

function createAvifWorker() {
    const worker = new Worker(
        new URL("../Converter/avif.worker.js", document.baseURI),
        { type: "module" }
    );

    return {
        request(type, payload, transfer = []) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok) {
                        resolve(event.data);
                    } else {
                        reject(new Error(event.data.message || "AVIF error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("AVIF Worker error"));
                };

                worker.postMessage({ type, ...payload }, transfer);
            });
        },
        terminate() {
            worker.terminate();
        }
    };
}

function createHeicDecoder() {
    const worker = new Worker(
        new URL("../Converter/heic.worker.js", document.baseURI),
        { type: "module" }
    );

    return {
        decode(file) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok && event.data.blob) {
                        resolve(event.data.blob);
                    } else {
                        reject(new Error(event.data.message || "HEIC error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("HEIC Worker error"));
                };

                worker.postMessage({ type: "decode", file });
            });
        },
        terminate() {
            worker.terminate();
        }
    };
}

function createHeicEncoder() {
    const worker = new Worker(
        new URL("../Converter/heic-encoder.worker.js", document.baseURI),
        { type: "module" }
    );

    return {
        encode(pixels, width, height) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok) {
                        resolve(event.data.buffer);
                    } else {
                        reject(new Error(event.data.message || "HEIC encoding error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("HEIC encoder error"));
                };

                worker.postMessage(
                    { type: "encode", pixels, width, height },
                    [pixels]
                );
            });
        },
        terminate() {
            worker.terminate();
        }
    };
}

function createTiffWorker() {
    const worker = new Worker(
        new URL("../Converter/tiff.worker.js", document.baseURI)
    );

    return {
        decode(file) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    const data = event.data;

                    if (data.confirmationRequired) {
                        const message = translations[language].tiffWarning
                            .replace("{width}", data.width)
                            .replace("{height}", data.height);

                        worker.postMessage({
                            type: "continue",
                            accepted: window.confirm(message)
                        });
                        return;
                    }

                    if (data.ok) {
                        resolve(data.cancelled ? null : data);
                    } else {
                        reject(new Error(data.message || "TIFF error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("TIFF Worker error"));
                };

                worker.postMessage({ type: "decode", file });
            });
        },

        encode(pixels, width, height) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok) {
                        resolve(event.data.buffer);
                    } else {
                        reject(new Error(event.data.message || "TIFF encoding error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("TIFF encoder error"));
                };

                worker.postMessage(
                    { type: "encode", pixels, width, height },
                    [pixels]
                );
            });
        },

        terminate() {
            worker.terminate();
        }
    };
}

// --------------------------------------------------
// Yardımcı fonksiyonlar
// --------------------------------------------------

function getExtension(file) {
    return file.name.split(".").pop().toLowerCase();
}

function getDimensions(image) {
    return {
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
    };
}

function canvasToBlob(canvas, type) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob && blob.type === type) {
                resolve(blob);
            } else {
                reject(new Error("Unsupported output format: " + type));
            }
        }, type, 0.92);
    });
}

function canvasToBmp(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const pixels = canvas.getContext("2d").getImageData(
        0, 0, width, height
    ).data;

    const rowSize = Math.floor((width * 3 + 3) / 4) * 4;
    const imageSize = rowSize * height;
    const buffer = new ArrayBuffer(54 + imageSize);
    const view = new DataView(buffer);
    const output = new Uint8Array(buffer);

    view.setUint8(0, 0x42);
    view.setUint8(1, 0x4D);
    view.setUint32(2, buffer.byteLength, true);
    view.setUint32(10, 54, true);
    view.setUint32(14, 40, true);
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);
    view.setUint16(26, 1, true);
    view.setUint16(28, 24, true);
    view.setUint32(34, imageSize, true);

    for (let y = 0; y < height; y++) {
        const targetY = height - 1 - y;
        const rowStart = 54 + targetY * rowSize;

        for (let x = 0; x < width; x++) {
            const source = (y * width + x) * 4;
            const target = rowStart + x * 3;
            const alpha = pixels[source + 3] / 255;

            output[target] =
                Math.round(pixels[source + 2] * alpha + 255 * (1 - alpha));
            output[target + 1] =
                Math.round(pixels[source + 1] * alpha + 255 * (1 - alpha));
            output[target + 2] =
                Math.round(pixels[source] * alpha + 255 * (1 - alpha));
        }
    }

    return new Blob([buffer], { type: "image/bmp" });
}

function canvasToIco(canvas) {
    const sizes = [16, 32, 48, 256];
    const images = [];

    for (const size of sizes) {
        const iconCanvas = document.createElement("canvas");
        iconCanvas.width = size;
        iconCanvas.height = size;

        const context = iconCanvas.getContext("2d");
        const scale = Math.min(
            size / canvas.width,
            size / canvas.height
        );

        const width = canvas.width * scale;
        const height = canvas.height * scale;

        context.drawImage(
            canvas,
            (size - width) / 2,
            (size - height) / 2,
            width,
            height
        );

        const pixels = context.getImageData(0, 0, size, size).data;
        const rowSize = Math.ceil(size / 32) * 4;
        const xorSize = size * size * 4;
        const andSize = rowSize * size;
        const buffer = new ArrayBuffer(40 + xorSize + andSize);
        const view = new DataView(buffer);
        const output = new Uint8Array(buffer);

        view.setUint32(0, 40, true);
        view.setInt32(4, size, true);
        view.setInt32(8, size * 2, true);
        view.setUint16(12, 1, true);
        view.setUint16(14, 32, true);
        view.setUint32(20, xorSize + andSize, true);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const source = (y * size + x) * 4;
                const target = 40 + ((size - 1 - y) * size + x) * 4;

                output[target] = pixels[source + 2];
                output[target + 1] = pixels[source + 1];
                output[target + 2] = pixels[source];
                output[target + 3] = pixels[source + 3];
            }
        }

        const maskStart = 40 + xorSize;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const alpha = pixels[(y * size + x) * 4 + 3];

                if (alpha < 128) {
                    const row = size - 1 - y;
                    const index = maskStart + row * rowSize + Math.floor(x / 8);
                    output[index] |= 1 << (7 - (x % 8));
                }
            }
        }

        images.push(new Uint8Array(buffer));
    }

    const headerSize = 6 + sizes.length * 16;
    const totalSize = headerSize +
        images.reduce((sum, image) => sum + image.length, 0);

    const result = new ArrayBuffer(totalSize);
    const view = new DataView(result);
    const output = new Uint8Array(result);

    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, sizes.length, true);

    let offset = headerSize;

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const image = images[i];
        const entry = 6 + i * 16;

        view.setUint8(entry, size === 256 ? 0 : size);
        view.setUint8(entry + 1, size === 256 ? 0 : size);
        view.setUint16(entry + 4, 1, true);
        view.setUint16(entry + 6, 32, true);
        view.setUint32(entry + 8, image.length, true);
        view.setUint32(entry + 12, offset, true);

        output.set(image, offset);
        offset += image.length;
    }

    return new Blob([result], { type: "image/x-icon" });
}

function pixelsToCanvas(result) {
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas unavailable");
    }

    context.putImageData(
        new ImageData(
            new Uint8ClampedArray(result.pixels),
            result.width,
            result.height
        ),
        0,
        0
    );

    return canvas;
}

function loadBlobAsImage(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => resolve({ image, url });
        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Image loading failed"));
        };

        image.src = url;
    });
}

// --------------------------------------------------
// SVG desteği
// --------------------------------------------------

function parseSvg(fileText) {
    const xml = new DOMParser().parseFromString(
        fileText,
        "image/svg+xml"
    );

    const root = xml.documentElement;

    if (
        xml.getElementsByTagName("parsererror").length ||
        root.localName.toLowerCase() !== "svg"
    ) {
        throw new Error("Invalid SVG");
    }

    function parseLength(value) {
        if (!value) return null;

        const match = String(value).trim().match(
            /^([+]?(?:\d+\.?\d*|\.\d+))(?:px)?$/i
        );

        if (!match) return null;

        const number = Number(match[1]);
        return Number.isFinite(number) && number > 0 ? number : null;
    }

    let width = parseLength(root.getAttribute("width"));
    let height = parseLength(root.getAttribute("height"));

    const viewBox = (root.getAttribute("viewBox") || "")
        .trim()
        .split(/[\s,]+/)
        .map(Number);

    const validViewBox =
        viewBox.length === 4 &&
        viewBox.every(Number.isFinite) &&
        viewBox[2] > 0 &&
        viewBox[3] > 0;

    if ((!width || !height) && validViewBox) {
        if (width) height = width * viewBox[3] / viewBox[2];
        else if (height) width = height * viewBox[2] / viewBox[3];
        else {
            width = viewBox[2];
            height = viewBox[3];
        }
    }

    if (!width || !height) {
        throw new Error("SVG dimensions unavailable");
    }

    root.setAttribute("width", width);
    root.setAttribute("height", height);

    if (!root.hasAttribute("viewBox")) {
        root.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    return {
        width: Math.round(width),
        height: Math.round(height),
        text: new XMLSerializer().serializeToString(root)
    };
}

function createRotatedSvg() {
    const parsed = new DOMParser().parseFromString(
        svgSource,
        "image/svg+xml"
    );

    const root = parsed.documentElement;
    const { width, height } = getDimensions(originalImage);

    const sideways = Math.abs(rotation) % 180 === 90;
    const outputWidth = sideways ? height : width;
    const outputHeight = sideways ? width : height;

    const sx = flipHorizontal ? -1 : 1;
    const sy = flipVertical ? -1 : 1;

    const nestedSvg = new XMLSerializer().serializeToString(root);

    const transform =
        `translate(${outputWidth / 2} ${outputHeight / 2}) ` +
        `rotate(${rotation}) scale(${sx} ${sy}) ` +
        `translate(${-width / 2} ${-height / 2})`;

    const output = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${outputWidth}"
             height="${outputHeight}"
             viewBox="0 0 ${outputWidth} ${outputHeight}">
            <g transform="${transform}">
                ${nestedSvg}
            </g>
        </svg>
    `;

    return new Blob([output], {
        type: "image/svg+xml"
    });
}

// --------------------------------------------------
// Dil sistemi
// --------------------------------------------------

function setLanguage(lang) {
    language = lang;
    const t = translations[lang];

    document.documentElement.lang = lang;
    document.title = `EBTools - ${t.title}`;

    $("pageTitle").textContent = t.title;
    $("subtitle").textContent = t.subtitle;
    $("chooseText").textContent = t.choose;
    $("supportedText").textContent = t.supported;
    $("rotateTitle").textContent = t.rotate;
    $("flipTitle").textContent = t.flip;
    $("rotateLeftText").textContent = t.left;
    $("rotateRightText").textContent = t.right;
    $("flipHorizontalText").textContent = t.horizontal;
    $("flipVerticalText").textContent = t.vertical;
    $("resetText").textContent = t.reset;
    $("downloadText").textContent = t.download;
    $("footerText").textContent = t.footer;
    $("backLink").textContent = t.home;
    document.querySelector(".previous-page").textContent = t.previous;

    $("trButton").classList.toggle("active", lang === "tr");
    $("enButton").classList.toggle("active", lang === "en");

    try {
        localStorage.setItem("ebToolsLanguage", lang);
    } catch (error) {}
}

$("trButton").addEventListener("click", () => setLanguage("tr"));
$("enButton").addEventListener("click", () => setLanguage("en"));

// --------------------------------------------------
// Görsel yükleme
// --------------------------------------------------

function clearCurrentImage() {
    if (originalUrl) {
        URL.revokeObjectURL(originalUrl);
        originalUrl = null;
    }

    originalImage = null;
    currentFile = null;
    svgSource = null;

    rotation = 0;
    flipHorizontal = false;
    flipVertical = false;

    $("preview").removeAttribute("src");
    $("previewWrap").style.display = "none";
    $("fileName").textContent = "";
    $("fileInfo").textContent = "";
    $("status").textContent = "";

    buttons.forEach(button => {
        button.disabled = true;
    });
}

async function loadImage(file) {
    if (!file) return;

    clearCurrentImage();

    const extension = getExtension(file);

    const allowedExtensions = [
        "png", "jpg", "jpeg", "webp", "avif",
        "heic", "heif", "tif", "tiff",
        "svg", "bmp", "gif", "ico"
    ];

    if (!allowedExtensions.includes(extension)) {
        $("status").textContent = translations[language].invalid;
        return;
    }

    $("status").textContent = "";

    try {
        let image;
        let url = null;

        if (extension === "heic" || extension === "heif") {
            if (!window.confirm(translations[language].heicWarning)) {
                return;
            }

            const worker = createHeicDecoder();

            try {
                const blob = await worker.decode(file);
                const result = await loadBlobAsImage(blob);
                image = result.image;
                url = result.url;
            } finally {
                worker.terminate();
            }

        } else if (extension === "tif" || extension === "tiff") {
            const worker = createTiffWorker();

            try {
                const result = await worker.decode(file);

                if (!result) return;

                image = pixelsToCanvas(result);
            } finally {
                worker.terminate();
            }

        } else if (extension === "avif") {
            const worker = createAvifWorker();

            try {
                const buffer = await file.arrayBuffer();

                const result = await worker.request(
                    "decode",
                    { buffer },
                    [buffer]
                );

                image = pixelsToCanvas(result);
            } finally {
                worker.terminate();
            }

        } else if (extension === "svg") {
            const parsed = parseSvg(await file.text());

            svgSource = parsed.text;

            const blob = new Blob(
                [svgSource],
                { type: "image/svg+xml" }
            );

            const result = await loadBlobAsImage(blob);
            image = result.image;
            url = result.url;

        } else {
            const result = await loadBlobAsImage(file);
            image = result.image;
            url = result.url;
        }

        if (!image) {
            throw new Error("Image could not be loaded");
        }

        const dimensions = getDimensions(image);

        if (
            dimensions.width * dimensions.height > 40000000 &&
            !window.confirm(translations[language].largeWarning)
        ) {
            if (url) URL.revokeObjectURL(url);
            return;
        }

        originalImage = image;
        currentFile = file;
        originalUrl = url;

        $("fileName").textContent = file.name;
        $("fileInfo").textContent =
            `${dimensions.width} × ${dimensions.height} px`;

        buttons.forEach(button => {
            button.disabled = false;
        });

        $("previewWrap").style.display = "flex";

        renderImage();

        $("status").textContent = translations[language].loaded;

    } catch (error) {
        console.error("Rotate image loading error:", error);

        clearCurrentImage();

        $("status").textContent =
            extension === "avif"
                ? translations[language].avifError
                : extension === "heic" || extension === "heif"
                    ? translations[language].heicError
                    : extension === "tif" || extension === "tiff"
                        ? translations[language].tiffError
                        : extension === "svg"
                            ? translations[language].svgError
                            : translations[language].loadError;
    }
}

$("fileInput").addEventListener("change", () => {
    loadImage($("fileInput").files[0]);
});

const dropzone = document.querySelector(".dropzone");
let dragCounter = 0;

dropzone.addEventListener("dragenter", event => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter++;
    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragover", event => {
    event.preventDefault();
    event.stopPropagation();
});

dropzone.addEventListener("dragleave", event => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter--;

    if (dragCounter <= 0) {
        dragCounter = 0;
        dropzone.classList.remove("dragover");
    }
});

dropzone.addEventListener("drop", event => {
    event.preventDefault();
    event.stopPropagation();

    dragCounter = 0;
    dropzone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {
        loadImage(file);
    }
});

// --------------------------------------------------
// Döndürme ve aynalama
// --------------------------------------------------

function createCanvas() {
    const dimensions = getDimensions(originalImage);
    const width = dimensions.width;
    const height = dimensions.height;

    const sideways = Math.abs(rotation) % 180 === 90;

    const canvas = document.createElement("canvas");

    canvas.width = sideways ? height : width;
    canvas.height = sideways ? width : height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas unavailable");
    }

    if (currentFile && (
        getExtension(currentFile) === "jpg" ||
        getExtension(currentFile) === "jpeg"
    )) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(rotation * Math.PI / 180);

    context.scale(
        flipHorizontal ? -1 : 1,
        flipVertical ? -1 : 1
    );

    context.drawImage(
        originalImage,
        -width / 2,
        -height / 2,
        width,
        height
    );

    return canvas;
}

function renderImage() {
    if (!originalImage) return;

    const canvas = createCanvas();
    $("preview").src = canvas.toDataURL("image/png");
}

$("rotateLeftButton").addEventListener("click", () => {
    rotation = (rotation - 90 + 360) % 360;
    renderImage();
});

$("rotateRightButton").addEventListener("click", () => {
    rotation = (rotation + 90) % 360;
    renderImage();
});

$("flipHorizontalButton").addEventListener("click", () => {
    flipHorizontal = !flipHorizontal;
    renderImage();
});

$("flipVerticalButton").addEventListener("click", () => {
    flipVertical = !flipVertical;
    renderImage();
});

$("resetButton").addEventListener("click", () => {
    rotation = 0;
    flipHorizontal = false;
    flipVertical = false;

    renderImage();

    $("status").textContent = translations[language].resetDone;
});

// --------------------------------------------------
// Orijinal formatta kaydetme
// --------------------------------------------------

async function encodeImage(canvas) {
    const extension = getExtension(currentFile);

    if (extension === "svg") {
        return createRotatedSvg();
    }

    if (extension === "bmp") {
        return canvasToBmp(canvas);
    }

    if (extension === "ico") {
        return canvasToIco(canvas);
    }

    if (extension === "avif") {
        const worker = createAvifWorker();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );

            const buffer = pixels.data.buffer;

            const result = await worker.request(
                "encode",
                {
                    pixels: buffer,
                    width: canvas.width,
                    height: canvas.height,
                    quality: 0.92
                },
                [buffer]
            );

            return new Blob(
                [result.buffer],
                { type: "image/avif" }
            );
        } finally {
            worker.terminate();
        }
    }

    if (extension === "heic" || extension === "heif") {
        const worker = createHeicEncoder();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );

            const buffer = pixels.data.buffer;

            const encoded = await worker.encode(
                buffer,
                canvas.width,
                canvas.height
            );

            return new Blob(
                [encoded],
                { type: "image/heic" }
            );
        } finally {
            worker.terminate();
        }
    }

    if (extension === "tif" || extension === "tiff") {
        const worker = createTiffWorker();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );

            const buffer = pixels.data.buffer;

            const encoded = await worker.encode(
                buffer,
                canvas.width,
                canvas.height
            );

            return new Blob(
                [encoded],
                { type: "image/tiff" }
            );
        } finally {
            worker.terminate();
        }
    }

    if (extension === "gif") {
        if (typeof GIF === "undefined") {
            throw new Error("GIF encoder is unavailable");
        }

        return new Promise((resolve, reject) => {
            const gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: "../Converter/gif.worker.js"
            });

            let settled = false;

            gif.addFrame(canvas, { delay: 100 });

            gif.on("finished", blob => {
                settled = true;
                resolve(blob);
            });

            gif.activeWorkers.forEach(worker => {
                worker.addEventListener("error", event => {
                    if (settled) return;
                    settled = true;
                    event.preventDefault();
                    gif.abort();
                    reject(new Error("GIF Worker error"));
                });
            });

            gif.render();
        });
    }

    const formats = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        webp: "image/webp"
    };

    const type = formats[extension];

    if (!type) {
        throw new Error("Unsupported output format");
    }

    return canvasToBlob(canvas, type);
}

$("downloadButton").addEventListener("click", async () => {
    if (!originalImage || !currentFile) return;

    const button = $("downloadButton");
    button.disabled = true;

    try {
        const blob = await encodeImage(createCanvas());

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = currentFile.name;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        $("status").textContent = translations[language].downloadDone;

    } catch (error) {
        console.error("Rotate encoding error:", error);
        $("status").textContent = translations[language].encodingError;

    } finally {
        button.disabled = false;
    }
});

// --------------------------------------------------
// Sayfa başlangıcı
// --------------------------------------------------

try {
    const savedLanguage = localStorage.getItem("ebToolsLanguage");

    if (savedLanguage === "tr" || savedLanguage === "en") {
        language = savedLanguage;
    }
} catch (error) {}

setLanguage(language);
