
const $ = id => document.getElementById(id);

let language = localStorage.getItem("ebToolsLanguage") === "en" ? "en" : "tr";
let selectedFiles = [];
let isCompressing = false;

const T = {
    tr: {
        browserTitle: "EBTools - Görsel Sıkıştırıcı",
        title: "Görsel Sıkıştırıcı",
        subtitle: "Birden fazla görsel seç, dosya boyutlarını küçült. İşlemler cihazında yapılır.",
        choose: "Görselleri seçmek için tıkla veya sürükleyip bırak",
        supported: "JPG, PNG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, BMP, GIF ve ICO · GIF ve TIFF dosyalarında yalnızca ilk kare/sayfa işlenir.",
        queueTitle: "Seçilen görseller",
        clear: "Listeyi temizle",
        empty: "Henüz görsel seçilmedi.",
        settings: "Sıkıştırma ayarları",
        quality: "Görüntü kalitesi",
        qualityNote: "Kalite ayarı JPG, WebP ve AVIF için etkilidir. Diğer formatlarda hedef boyut için gerekirse görsel ölçüleri küçültülür.",
        target: "Hedef dosya boyutu (KB) — isteğe bağlı",
        targetNote: "Hedef boyut garanti edilmez. Gerekirse görselin çözünürlüğü düşürülür. PNG, BMP, TIFF ve ICO gibi formatlarda sıkıştırma sınırlı olabilir.",
        compress: "Tümünü sıkıştır",
        compressing: "Sıkıştırılıyor...",
        ready: "Hazır",
        processing: "İşleniyor...",
        success: "Tamamlandı",
        failed: "Başarısız",
        results: "Sıkıştırma sonuçları",
        original: "Orijinal",
        result: "Sonuç",
        saved: "Küçüldü",
        increased: "Büyüdü",
        unchanged: "Değişmedi",
        download: "İndir",
        total: "Toplam",
        totalOriginal: "Orijinal toplam",
        totalResult: "Sonuç toplamı",
        selectFirst: "Lütfen önce görsel seç.",
        invalidTarget: "Hedef boyut 1 ile 100000 KB arasında olmalıdır.",
        unsupported: "Desteklenmeyen dosya:",
        loadError: "Görsel açılamadı:",
        compressError: "Sıkıştırma başarısız:",
        largeWarning: "Bu görsel çok büyük. İşlem tarayıcıda yüksek bellek kullanabilir. Devam etmek istiyor musunuz?",
        heicWarning: "HEIC/HEIF dosyası açılırken yüksek bellek kullanılabilir. Devam etmek istiyor musunuz?",
        tiffWarning: "Bu TIFF görseli çok büyük. İşlem tarayıcıda yüksek bellek kullanabilir. Devam etmek istiyor musunuz?",
        noCanvas: "Tarayıcı görsel işleme özelliğini desteklemiyor.",
        noEncoder: "Bu format için kodlayıcı kullanılamıyor.",
        footer: "EBTools · Ücretsiz çevrimiçi araçlar",
        reduction: "Boyut değişimi",
        targetReached: "Hedef boyuta ulaşıldı.",
        targetMissed: "Hedef boyuta ulaşılamadı; elde edilen en küçük dosya sunuldu.",
        allDone: "İşlem tamamlandı."
    },
    en: {
        browserTitle: "EBTools - Image Compressor",
        title: "Image Compressor",
        subtitle: "Select multiple images and reduce their file sizes. Processing happens on your device.",
        choose: "Click to choose images or drag and drop",
        supported: "JPG, PNG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, BMP, GIF and ICO · Only the first frame/page is processed for GIF and TIFF.",
        queueTitle: "Selected images",
        clear: "Clear list",
        empty: "No images selected yet.",
        settings: "Compression settings",
        quality: "Image quality",
        qualityNote: "Quality applies to JPG, WebP and AVIF. For other formats, dimensions may be reduced if needed to approach the target size.",
        target: "Target file size (KB) — optional",
        targetNote: "The target size is not guaranteed. Image resolution may be reduced if needed. Compression may be limited for PNG, BMP, TIFF and ICO.",
        compress: "Compress all",
        compressing: "Compressing...",
        ready: "Ready",
        processing: "Processing...",
        success: "Completed",
        failed: "Failed",
        results: "Compression results",
        original: "Original",
        result: "Result",
        saved: "Reduced",
        increased: "Increased",
        unchanged: "Unchanged",
        download: "Download",
        total: "Total",
        totalOriginal: "Original total",
        totalResult: "Result total",
        selectFirst: "Please select images first.",
        invalidTarget: "Target size must be between 1 and 100000 KB.",
        unsupported: "Unsupported file:",
        loadError: "Could not open image:",
        compressError: "Compression failed:",
        largeWarning: "This image is very large. Processing may use substantial browser memory. Continue?",
        heicWarning: "Opening HEIC/HEIF may use substantial memory. Continue?",
        tiffWarning: "This TIFF image is very large. Processing may use substantial browser memory. Continue?",
        noCanvas: "Your browser does not support image processing.",
        noEncoder: "The encoder for this format is unavailable.",
        footer: "EBTools · Free online tools",
        reduction: "Size change",
        targetReached: "Target size reached.",
        targetMissed: "Target size could not be reached; the smallest result was provided.",
        allDone: "Processing completed."
    }
};

function tr(key) {
    return T[language][key] || key;
}

function setLanguage(lang) {
    language = lang;
    localStorage.setItem("ebToolsLanguage", lang);
    document.documentElement.lang = lang;

    $("trButton").classList.toggle("active", lang === "tr");
    $("enButton").classList.toggle("active", lang === "en");

    document.title = tr("browserTitle");
    $("pageTitle").textContent = tr("title");
    $("subtitle").textContent = tr("subtitle");
    $("backLink").textContent = lang === "tr" ? "Ana sayfa" : "Home";
    $("chooseText").textContent = tr("choose");
    $("supportedText").textContent = tr("supported");
    
    $("clearButton").textContent = tr("clear");
    $("settingsTitle").textContent = tr("settings");
    $("qualityLabel").textContent = tr("quality");
    $("qualityNote").textContent = tr("qualityNote");
    $("targetSizeLabel").textContent = tr("target");
    $("targetSizeNote").textContent = tr("targetNote");
    $("compressButton").textContent = isCompressing ? tr("compressing") : tr("compress");
    $("resultTitle").textContent = tr("results");
    $("footerText").textContent = tr("footer");

    updateQualityValue();
    renderQueue();
}

$("trButton").addEventListener("click", () => setLanguage("tr"));
$("enButton").addEventListener("click", () => setLanguage("en"));

function updateQualityValue() {
    $("qualityValue").textContent = $("qualityInput").value + "%";
}

$("qualityInput").addEventListener("input", updateQualityValue);

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function getExtension(file) {
    return file.name.split(".").pop().toLowerCase();
}

function getFormat(file) {
    const ext = getExtension(file);

    const formats = {
        jpg: "jpeg",
        jpeg: "jpeg",
        png: "png",
        webp: "webp",
        avif: "avif",
        heic: "heic",
        heif: "heic",
        tif: "tiff",
        tiff: "tiff",
        bmp: "bmp",
        gif: "gif",
        ico: "ico"
    };

    return formats[ext] || null;
}

function getMime(format) {
    const types = {
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        avif: "image/avif",
        heic: "image/heic",
        tiff: "image/tiff",
        bmp: "image/bmp",
        gif: "image/gif",
        ico: "image/x-icon"
    };

    return types[format];
}

function makeCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    if (!canvas.getContext("2d")) {
        throw new Error(tr("noCanvas"));
    }

    return canvas;
}

function loadImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Image loading failed"));
        };

        image.src = url;
    });
}

function createAvifWorkerClient() {
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
                        reject(new Error(event.data.message || "AVIF worker error"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("AVIF worker failed"));
                };

                worker.postMessage({ type, ...payload }, transfer);
            });
        },
        terminate() {
            worker.terminate();
        }
    };
}

function createHeicWorkerClient() {
    const worker = new Worker(
        new URL("../Converter/heic.worker.js", document.baseURI),
        { type: "module" }
    );

    return {
        decode(file) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok && event.data.blob instanceof Blob) {
                        resolve(event.data.blob);
                    } else {
                        reject(new Error(event.data.message || "HEIC decode failed"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("HEIC worker failed"));
                };

                worker.postMessage({ type: "decode", file });
            });
        },
        terminate() {
            worker.terminate();
        }
    };
}

function createHeicEncoderClient() {
    const worker = new Worker(
        new URL("../Converter/heic-encoder.worker.js", document.baseURI),
        { type: "module" }
    );

    return {
        encode(pixels, width, height) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok && event.data.buffer) {
                        resolve(event.data.buffer);
                    } else {
                        reject(new Error(event.data.message || "HEIC encode failed"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("HEIC encoder failed"));
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

function createTiffWorkerClient() {
    const worker = new Worker(
        new URL("../Converter/tiff.worker.js", document.baseURI)
    );

    return {
        decode(file) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    const data = event.data;

                    if (data.confirmationRequired) {
                        const accepted = window.confirm(tr("tiffWarning"));
                        worker.postMessage({
                            type: "continue",
                            accepted
                        });
                        return;
                    }

                    if (data.ok) {
                        resolve(data.cancelled ? null : data);
                    } else {
                        reject(new Error(data.message || "TIFF decode failed"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("TIFF worker failed"));
                };

                worker.postMessage({ type: "decode", file });
            });
        },

        encode(pixels, width, height) {
            return new Promise((resolve, reject) => {
                worker.onmessage = event => {
                    if (event.data.ok && event.data.buffer) {
                        resolve(event.data.buffer);
                    } else {
                        reject(new Error(event.data.message || "TIFF encode failed"));
                    }
                };

                worker.onerror = event => {
                    event.preventDefault();
                    reject(new Error("TIFF encoder failed"));
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

function canvasToBmp(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const pixels = canvas.getContext("2d").getImageData(0, 0, width, height).data;

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
        const rowStart = 54 + (height - 1 - y) * rowSize;

        for (let x = 0; x < width; x++) {
            const src = (y * width + x) * 4;
            const dst = rowStart + x * 3;
            const alpha = pixels[src + 3] / 255;

            output[dst] = Math.round(pixels[src + 2] * alpha + 255 * (1 - alpha));
            output[dst + 1] = Math.round(pixels[src + 1] * alpha + 255 * (1 - alpha));
            output[dst + 2] = Math.round(pixels[src] * alpha + 255 * (1 - alpha));
        }
    }

    return new Blob([buffer], { type: "image/bmp" });
}

function canvasToIco(canvas) {
    const sizes = [16, 32, 48, 256];
    const images = [];

    for (const size of sizes) {
        const iconCanvas = makeCanvas(size, size);
        const ctx = iconCanvas.getContext("2d");
        const scale = Math.min(size / canvas.width, size / canvas.height);
        const width = canvas.width * scale;
        const height = canvas.height * scale;

        ctx.drawImage(
            canvas,
            (size - width) / 2,
            (size - height) / 2,
            width,
            height
        );

        const pixels = ctx.getImageData(0, 0, size, size).data;
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
                const src = (y * size + x) * 4;
                const dst = 40 + ((size - 1 - y) * size + x) * 4;

                output[dst] = pixels[src + 2];
                output[dst + 1] = pixels[src + 1];
                output[dst + 2] = pixels[src];
                output[dst + 3] = pixels[src + 3];

                if (pixels[src + 3] < 128) {
                    const maskStart = 40 + xorSize;
                    const maskIndex = maskStart +
                        (size - 1 - y) * rowSize + Math.floor(x / 8);

                    output[maskIndex] |= 1 << (7 - (x % 8));
                }
            }
        }

        images.push(new Uint8Array(buffer));
    }

    const headerSize = 6 + sizes.length * 16;
    const totalSize = headerSize + images.reduce((sum, item) => sum + item.length, 0);
    const result = new ArrayBuffer(totalSize);
    const view = new DataView(result);
    const output = new Uint8Array(result);

    view.setUint16(2, 1, true);
    view.setUint16(4, sizes.length, true);

    let offset = headerSize;

    sizes.forEach((size, index) => {
        const entry = 6 + index * 16;
        const image = images[index];

        view.setUint8(entry, size === 256 ? 0 : size);
        view.setUint8(entry + 1, size === 256 ? 0 : size);
        view.setUint16(entry + 4, 1, true);
        view.setUint16(entry + 6, 32, true);
        view.setUint32(entry + 8, image.length, true);
        view.setUint32(entry + 12, offset, true);

        output.set(image, offset);
        offset += image.length;
    });

    return new Blob([result], { type: "image/x-icon" });
}

async function decodeFile(file, format) {
    if (file.size > 25 * 1024 * 1024 &&
        !window.confirm(tr("largeWarning"))) {
        throw new Error("cancelled");
    }

    if (format === "heic" && !window.confirm(tr("heicWarning"))) {
        throw new Error("cancelled");
    }

    if (format === "tiff") {
        const client = createTiffWorkerClient();

        try {
            const result = await client.decode(file);
            if (!result) throw new Error("cancelled");

            const canvas = makeCanvas(result.width, result.height);
            const ctx = canvas.getContext("2d");

            ctx.putImageData(
                new ImageData(
                    new Uint8ClampedArray(result.pixels),
                    result.width,
                    result.height
                ),
                0,
                0
            );

            return canvas;
        } finally {
            client.terminate();
        }
    }

    if (format === "avif") {
        const client = createAvifWorkerClient();

        try {
            const buffer = await file.arrayBuffer();
            const result = await client.request("decode", { buffer }, [buffer]);

            const canvas = makeCanvas(result.width, result.height);
            canvas.getContext("2d").putImageData(
                new ImageData(
                    new Uint8ClampedArray(result.pixels),
                    result.width,
                    result.height
                ),
                0,
                0
            );

            return canvas;
        } finally {
            client.terminate();
        }
    }

    if (format === "heic") {
        const client = createHeicWorkerClient();

        try {
            const blob = await client.decode(file);
            const image = await loadImageFromBlob(blob);
            const canvas = makeCanvas(image.naturalWidth, image.naturalHeight);
            canvas.getContext("2d").drawImage(image, 0, 0);
            return canvas;
        } finally {
            client.terminate();
        }
    }

    const image = await loadImageFromBlob(file);
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;

    if (!width || !height) throw new Error("Invalid image dimensions");

    const canvas = makeCanvas(width, height);
    canvas.getContext("2d").drawImage(image, 0, 0);

    return canvas;
}

function canvasToBlob(canvas, mime, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob || blob.type !== mime) {
                reject(new Error(tr("noEncoder")));
                return;
            }

            resolve(blob);
        }, mime, quality);
    });
}

async function encodeCanvas(canvas, format, quality) {
    if (format === "bmp") return canvasToBmp(canvas);
    if (format === "ico") return canvasToIco(canvas);

    if (format === "avif") {
        const client = createAvifWorkerClient();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );
            const buffer = pixels.data.buffer;

            const result = await client.request("encode", {
                pixels: buffer,
                width: canvas.width,
                height: canvas.height,
                quality
            }, [buffer]);

            return new Blob([result.buffer], { type: "image/avif" });
        } finally {
            client.terminate();
        }
    }

    if (format === "heic") {
        const client = createHeicEncoderClient();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );
            const buffer = pixels.data.buffer;
            const result = await client.encode(buffer, canvas.width, canvas.height);

            return new Blob([result], { type: "image/heic" });
        } finally {
            client.terminate();
        }
    }

    if (format === "tiff") {
        const client = createTiffWorkerClient();

        try {
            const pixels = canvas.getContext("2d").getImageData(
                0, 0, canvas.width, canvas.height
            );
            const buffer = pixels.data.buffer;
            const result = await client.encode(buffer, canvas.width, canvas.height);

            return new Blob([result], { type: "image/tiff" });
        } finally {
            client.terminate();
        }
    }

    if (format === "gif") {
        if (typeof GIF === "undefined") {
            throw new Error(tr("noEncoder"));
        }

        return new Promise((resolve, reject) => {
            const gif = new GIF({
                workers: 2,
                quality: 10,
                workerScript: "../Converter/gif.worker.js"
            });

            let finished = false;

            gif.addFrame(canvas, { delay: 100 });

            gif.on("finished", blob => {
                finished = true;
                resolve(blob);
            });

            gif.activeWorkers.forEach(worker => {
                worker.addEventListener("error", event => {
                    if (finished) return;
                    finished = true;
                    event.preventDefault();
                    reject(new Error("GIF worker failed"));
                });
            });

            gif.render();
        });
    }

    const mime = getMime(format);
    const qualityValue = format === "jpeg" || format === "webp"
        ? quality
        : undefined;

    return canvasToBlob(canvas, mime, qualityValue);
}

function resizeCanvas(source, scale, format) {
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = makeCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (format === "jpeg" || format === "bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(source, 0, 0, width, height);
    return canvas;
}

async function compressCanvas(source, format, quality, targetBytes) {
    let scale = 1;
    let currentQuality = quality;
    let bestBlob = null;
    let qualityCanChange = ["jpeg", "webp", "avif"].includes(format);

    for (let attempt = 0; attempt < 12; attempt++) {
        const canvas = resizeCanvas(source, scale, format);
        const blob = await encodeCanvas(canvas, format, currentQuality);

        if (!bestBlob || blob.size < bestBlob.size) {
            bestBlob = blob;
        }

        if (!targetBytes || blob.size <= targetBytes) {
            return {
                blob,
                width: canvas.width,
                height: canvas.height,
                reached: !targetBytes || blob.size <= targetBytes
            };
        }

        if (qualityCanChange && currentQuality > 0.15) {
            currentQuality = Math.max(0.15, currentQuality - 0.12);
            continue;
        }

        if (scale > 0.12) {
            scale *= 0.78;
            continue;
        }

        break;
    }

    return {
        blob: bestBlob,
        width: Math.max(1, Math.round(source.width * scale)),
        height: Math.max(1, Math.round(source.height * scale)),
        reached: false
    };
}

function createQueueItem(item) {
    const card = document.createElement("div");
    card.className = "queue-item";
    card.dataset.id = item.id;

    const image = document.createElement("img");
    image.src = item.previewUrl;
    image.alt = item.file.name;

    const name = document.createElement("div");
    name.className = "queue-item-name";
    name.textContent = item.file.name;

    const info = document.createElement("div");
    info.className = "queue-item-info";
    info.textContent = formatBytes(item.file.size);

    const status = document.createElement("div");
    status.className = "queue-item-status";
    status.textContent = tr("ready");

    card.append(image, name, info, status);
    return card;
}

function renderQueue() {
    const list = $("fileList");
    list.replaceChildren();

    $("queueSummary").textContent = selectedFiles.length + " / " + selectedFiles.length;
    $("clearButton").disabled = selectedFiles.length === 0;
    $("compressButton").disabled = selectedFiles.length === 0 || isCompressing;

    selectedFiles.forEach(item => {
        const card = createQueueItem(item);
        list.appendChild(card);
    });

    if (selectedFiles.length === 0) {
        $("queueSummary").textContent = tr("empty");
    }
}

async function addFiles(files) {
    const allowed = ["jpeg", "png", "webp", "avif", "heic", "tiff", "bmp", "gif", "ico"];

    for (const file of files) {
        const format = getFormat(file);

        if (!format || !allowed.includes(format)) {
            alert(tr("unsupported") + " " + file.name);
            continue;
        }

        if (selectedFiles.some(item =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified
        )) {
            continue;
        }

        const item = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
            file,
            format,
            previewUrl: null,
            status: "ready"
        };

        try {
            const canvas = await decodeFile(file, format);
            const previewBlob = await canvasToBlob(
                resizeCanvas(canvas, Math.min(1, 220 / Math.max(canvas.width, canvas.height)), "png"),
                "image/png"
            );

            item.previewUrl = URL.createObjectURL(previewBlob);
            item.width = canvas.width;
            item.height = canvas.height;
            item.sourceCanvas = canvas;
            selectedFiles.push(item);
        } catch (error) {
            if (error.message !== "cancelled") {
                console.error(error);
                alert(tr("loadError") + " " + file.name);
            }
        }
    }

    renderQueue();
    $("status").textContent = selectedFiles.length
        ? tr("ready")
        : "";
}

function clearList() {
    if (isCompressing) return;

    selectedFiles.forEach(item => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });

    selectedFiles = [];
    $("resultPanel").style.display = "none";
    $("resultList").replaceChildren();
    $("totalSummary").textContent = "";
    $("status").textContent = "";
    $("fileInput").value = "";

    renderQueue();
}

$("fileInput").addEventListener("change", event => {
    addFiles(Array.from(event.target.files));
    event.target.value = "";
});

$("clearButton").addEventListener("click", clearList);

const dropzone = $("dropzone");

dropzone.addEventListener("click", event => {
    if (event.target.id !== "fileInput") {
        $("fileInput").click();
    }
});

dropzone.addEventListener("dragover", event => {
    event.preventDefault();
    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", event => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
    addFiles(Array.from(event.dataTransfer.files));
});

function updateQueueStatus(item, message) {
    const card = document.querySelector(
        `.queue-item[data-id="${CSS.escape(item.id)}"] .queue-item-status`
    );

    if (card) card.textContent = message;
}

function makeResultCard(item, blob, reached) {
    const card = document.createElement("div");
    card.className = "result-item";

    const preview = document.createElement("img");
    preview.className = "result-preview";

    const resultUrl = URL.createObjectURL(blob);
    item.resultUrl = resultUrl;
    preview.src = resultUrl;
    preview.alt = item.file.name;

    const details = document.createElement("div");
    details.className = "result-details";

    const name = document.createElement("div");
    name.className = "result-name";
    name.textContent = item.file.name;

    const original = document.createElement("div");
    original.className = "result-info";
    original.textContent = tr("original") + ": " + formatBytes(item.file.size);

    const result = document.createElement("div");
    result.className = "result-info";
    result.textContent = tr("result") + ": " + formatBytes(blob.size);

    const difference = blob.size - item.file.size;
    const percent = item.file.size
        ? (Math.abs(difference) / item.file.size * 100).toFixed(1)
        : "0.0";

    const savings = document.createElement("div");
    savings.className = "result-savings";

    if (difference > 0) {
        savings.textContent = "+" + percent + "% · " + tr("increased");
        savings.classList.add("increased");
    } else if (difference < 0) {
        savings.textContent = "-" + percent + "% · " + tr("saved");
    } else {
        savings.textContent = tr("unchanged");
    }

    const download = document.createElement("a");
    download.className = "result-download";
    download.href = resultUrl;
    download.download = item.file.name;
    download.textContent = tr("download");

    details.append(name, original, result, savings, download);

    if (!reached) {
        const note = document.createElement("div");
        note.className = "result-info";
        note.textContent = tr("targetMissed");
        details.appendChild(note);
    }

    card.append(preview, details);
    return card;
}

async function compressAll() {
    if (isCompressing || selectedFiles.length === 0) {
        if (!selectedFiles.length) $("status").textContent = tr("selectFirst");
        return;
    }

    const targetText = $("targetSizeInput").value.trim();
    const targetKB = Number(targetText);
    const hasTarget = targetText !== "";

    if (hasTarget &&
        (!Number.isFinite(targetKB) || targetKB < 1 || targetKB > 100000)) {
        $("status").textContent = tr("invalidTarget");
        return;
    }

    const targetBytes = hasTarget ? targetKB * 1024 : 0;
    const quality = Number($("qualityInput").value) / 100;

    isCompressing = true;
    $("compressButton").disabled = true;
    $("clearButton").disabled = true;
    $("compressButton").textContent = tr("compressing");
    $("resultPanel").style.display = "block";
    $("resultList").replaceChildren();
    $("totalSummary").textContent = "";
    $("status").textContent = tr("compressing");

    let totalOriginal = 0;
    let totalResult = 0;
    let completed = 0;

    try {
        for (const item of selectedFiles) {
            updateQueueStatus(item, tr("processing"));

            try {
                const result = await compressCanvas(
                    item.sourceCanvas,
                    item.format,
                    quality,
                    targetBytes
                );

                const expectedMime = getMime(item.format);

                if (!result.blob || result.blob.type !== expectedMime) {
                    throw new Error(tr("noEncoder"));
                }

                const card = makeResultCard(item, result.blob, result.reached);
                $("resultList").appendChild(card);

                totalOriginal += item.file.size;
                totalResult += result.blob.size;
                completed++;

                updateQueueStatus(item, tr("success"));
            } catch (error) {
                console.error("Compression error:", item.file.name, error);
                updateQueueStatus(item, tr("failed"));

                const errorCard = document.createElement("div");
                errorCard.className = "result-item";
                errorCard.textContent = tr("compressError") + " " + item.file.name;
                $("resultList").appendChild(errorCard);
            }

            $("status").textContent =
                completed + " / " + selectedFiles.length;
        }
    } finally {
        isCompressing = false;
        $("compressButton").disabled = selectedFiles.length === 0;
        $("clearButton").disabled = selectedFiles.length === 0;
        $("compressButton").textContent = tr("compress");

        if (completed > 0) {
            const difference = totalResult - totalOriginal;
            const percent = totalOriginal
                ? (Math.abs(difference) / totalOriginal * 100).toFixed(1)
                : "0.0";

            $("totalSummary").textContent =
                tr("totalOriginal") + ": " + formatBytes(totalOriginal) +
                " · " + tr("totalResult") + ": " + formatBytes(totalResult) +
                " · " + tr("reduction") + ": " +
                (difference > 0 ? "+" : difference < 0 ? "-" : "") +
                percent + "%";

            $("status").textContent = tr("allDone");
        } else {
            $("status").textContent = tr("failed");
        }
    }
}

$("compressButton").addEventListener("click", compressAll);

setLanguage(language);
renderQueue();
