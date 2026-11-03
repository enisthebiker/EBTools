
const $ = id => document.getElementById(id);

const translations = {
  tr: {
    browserTitle:"EBTools - Görsel Dönüştürücü",
    title:"Görsel Dönüştürücü",
    subtitle:"Görselini seç, formatını belirle ve dönüştür. İşlemler cihazında yapılır.",
    back:"← Ana sayfa",
    choose:"Görsel seçmek için tıkla veya sürükleyip bırak",
    supported:"PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, SVG, BMP, GIF ve ICO · GIF ve çok sayfalı TIFF dosyalarının ilk karesi/sayfası dönüştürülür",
    previewAlt:"Görsel önizlemesi",
    width:"Genişlik (px)",
    widthPlaceholder:"Genişlik",
    height:"Yükseklik (px)",
    heightPlaceholder:"Yükseklik",
    ratio:"En-boy oranını koru",
    resetDimensions:"Orijinal ölçülere dön",
    format:"Çıktı formatı",
    quality:"Görüntü kalitesi",
    qualityNote:"Kalite ayarı JPG, WebP ve AVIF için geçerlidir. PNG, BMP, GIF ve ICO bu ayardan etkilenmez.",
    heicQualityNote:"elheif kodlayıcısı sabit kalite kullanır; kalite kaydırıcısı HEIC'i etkilemez. Hedef boyut için çözünürlük düşürülebilir.",
    tiffQualityNote:"TIFF çıktısı sıkıştırmasız ve kayıpsızdır; kalite kaydırıcısı etkili değildir. Hedef boyut için çözünürlük düşürülebilir.",
    targetSize:"Hedef dosya boyutu (KB) — isteğe bağlı",
    targetSizePlaceholder:"Örn. 500",
    targetNote:"Hedef aşılırsa JPG/WebP/AVIF'te önce kalite, gerekirse piksel ölçüleri ayarlanır. HEIC'te kalite sabittir; TIFF sıkıştırmasızdır. Bu biçimlerde hedef için çözünürlük düşürülür. PNG, BMP, GIF ve ICO'da ölçüler ayarlanır. Tam hedef garanti değildir.",
    originalSize:"Orijinal dosya",
    resultSize:"Sonuç dosyası",
    savedSize:"Boyut farkı",
    reduction:"Değişim",
    sizeIncreased:"büyüdü",
    sizeDecreased:"küçüldü",
    sizeUnchanged:"Dosya boyutu değişmedi.",
    targetReached:"Hedef dosya boyutuna ulaşıldı.",
    targetReachedResized:"Hedef boyuta ulaşmak için görselin ölçüleri otomatik küçültüldü. Yeni ölçüler:",
    targetMissed:"Hedef boyuta ulaşılamadı. Elde edilen en küçük dosya sunuldu.",
    targetMissedResized:"Görselin ölçüleri küçültüldü ancak hedef boyuta ulaşılamadı. Son ölçüler:",
    convert:"Dönüştür",
    converting:"Dönüştürülüyor...",
    download:"Dönüştürülen görseli indir",
    footer:"EBTools · Ücretsiz çevrimiçi araçlar",
    selectFile:"Lütfen önce bir görsel seç.",
    badFile:"Bu dosya desteklenmiyor. PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF/TIF, SVG, BMP, GIF veya ICO seç.",
    svgDimensionsError:"SVG dosyasının geçerli genişlik/yükseklik ölçüleri veya kullanılabilir bir viewBox oranı bulunamadı.",
    svgDimensionsTitle:"SVG ölçüleri belirlenemedi",
    svgDimensionsPrompt:"SVG dosyasının geçerli genişlik/yükseklik ölçüleri veya kullanılabilir bir viewBox oranı bulunamadı. İptal edebilir ya da ölçüleri kendiniz belirleyebilirsiniz.",
    svgSetDimensions:"Ölçü belirle",
    cancel:"İptal",
    svgEnterDimensions:"Önizleme ve dönüştürme için genişlik ve yüksekliği girin.",
    svgLoadError:"SVG görseli açılamadı. Dosya geçersiz veya tarayıcı tarafından desteklenmeyen içerik barındırıyor olabilir.",
    loadError:"Görsel açılamadı. Başka bir dosya deneyebilirsin.",
    ready:"Görsel hazır. Dönüştürebilirsin.",
    success:"Dönüştürme tamamlandı.",
    failed:"Dönüştürme başarısız oldu. Başka bir format dene.",
    tooLarge:"Ölçüler 1 ile 12000 piksel arasında tam sayı olmalıdır.",
    largeImageWarning:"Bu görsel çok büyük. Dönüştürme yavaşlayabilir veya tarayıcınız yanıt vermeyebilir. Yine de devam etmek istiyor musunuz?",
    invalidTarget:"Hedef dosya boyutu 1 ile 100000 KB arasında olmalıdır.",
    targetPngNote:"PNG'de kalite ayarı dosya boyutunu düşürmez; bu nedenle piksel ölçüleri küçültülür.",
    targetQualityNote:"Hedef boyuta ulaşmak için JPG/WebP/AVIF kalitesi ayarlandı.",
    targetAndDimensionsNote:"Hedef boyuta ulaşmak için kalite ve piksel ölçüleri ayarlandı.",
    gifWorkerError:"GIF dönüştürme sırasında bir Worker hatası oluştu. Lütfen tekrar deneyin.",
    avifLoadError:"AVIF görseli çözülemedi. Dosya bozuk olabilir veya AVIF bileşeni yüklenemedi.",
      heicLoadError:"HEIC/HEIF görseli çözülemedi. Dosya bozuk olabilir veya HEIC bileşeni yüklenemedi.",
    tiffLoadError:"TIFF/TIF görseli açılamadı. Dosya bozuk olabilir veya TIFF bileşeni yüklenemedi.",
    tiffLargeImageWarning:"Bu TIFF görseli çok büyük ({width} × {height} piksel). Çözme sırasında yüksek bellek kullanılabilir ve tarayıcı yavaşlayabilir. Devam etmek istiyor musunuz?",
      heicDecodeWarning:"HEIC/HEIF dosyalarının boyutları çözme öncesinde okunamıyor. Görsel açılırken dosya boyutundan çok daha fazla bellek kullanılabilir ve işlem yavaşlayabilir. Devam etmek istiyor musunuz?",
    avifConversionError:"AVIF dönüştürme başarısız oldu. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    heicConversionError:"HEIC dönüştürme başarısız oldu. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    tiffConversionError:"TIFF dönüştürme başarısız oldu. Dosya çok büyük veya TIFF bileşeni yüklenememiş olabilir.",
    urlPlaceholder:"Görsel URL adresini yapıştır...",
    loadUrl:"URL'den Yükle",
    urlRequired:"Lütfen bir görsel adresi gir.",
    urlLoadError:"Görsel alınamadı. Adres geçersiz olabilir veya site dışarıdan erişime izin vermiyor.",
    urlImageName:"internet-gorseli"
  },
  en: {
    browserTitle:"EBTools - Image Converter",
    title:"Image Converter",
    subtitle:"Choose an image, select a format and convert it. Processing happens on your device.",
    back:"← Home",
    choose:"Click to choose an image or drag and drop",
    supported:"PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF, TIF, SVG, BMP, GIF and ICO · GIF files and multipage TIFFs use only the first frame/page",
    previewAlt:"Image preview",
    width:"Width (px)",
    widthPlaceholder:"Width",
    height:"Height (px)",
    heightPlaceholder:"Height",
    ratio:"Keep aspect ratio",
    resetDimensions:"Restore original dimensions",
    format:"Output format",
    quality:"Image quality",
    qualityNote:"Quality setting applies to JPG, WebP and AVIF. PNG, BMP, GIF and ICO are not affected by this setting.",
    heicQualityNote:"The elheif encoder uses a fixed quality; the quality slider does not affect HEIC. Resolution may be reduced to meet a target size.",
    tiffQualityNote:"TIFF output is uncompressed and lossless; the quality slider has no effect. Resolution may be reduced to meet a target size.",
    targetSize:"Target file size (KB) — optional",
    targetSizePlaceholder:"e.g. 500",
    targetNote:"If the target is exceeded, JPG/WebP/AVIF quality is reduced first, then dimensions if needed. HEIC uses fixed quality; TIFF is uncompressed. Their dimensions are reduced to meet the target. PNG, BMP, GIF and ICO dimensions are adjusted. Exact size is not guaranteed.",
    originalSize:"Original file",
    resultSize:"Result file",
    savedSize:"Size difference",
    reduction:"Change",
    sizeIncreased:"increased",
    sizeDecreased:"decreased",
    sizeUnchanged:"File size unchanged.",
    targetReached:"Target file size reached.",
    targetReachedResized:"Image dimensions were automatically reduced to reach the target. New dimensions:",
    targetMissed:"Target size could not be reached. The smallest result was provided.",
    targetMissedResized:"Image dimensions were reduced, but the target could not be reached. Final dimensions:",
    convert:"Convert",
    converting:"Converting...",
    download:"Download converted image",
    footer:"EBTools · Free online tools",
    selectFile:"Please choose an image first.",
    badFile:"Unsupported file. Choose PNG, JPG, WebP, AVIF, HEIC, HEIF, TIFF/TIF, SVG, BMP, GIF or ICO.",
    svgDimensionsError:"The SVG has no valid width/height dimensions or usable viewBox aspect ratio.",
    svgDimensionsTitle:"SVG dimensions are missing",
    svgDimensionsPrompt:"The SVG has no valid width/height dimensions or usable viewBox aspect ratio. You can cancel or enter the dimensions yourself.",
    svgSetDimensions:"Set dimensions",
    cancel:"Cancel",
    svgEnterDimensions:"Enter a width and height to preview and convert the SVG.",
    svgLoadError:"The SVG image could not be opened. The file may be invalid or contain content the browser cannot render.",
    loadError:"Could not open the image. Try another file.",
    ready:"Image ready. You can convert it.",
    success:"Conversion completed.",
    failed:"Conversion failed. Try another format.",
    tooLarge:"Dimensions must be whole numbers between 1 and 12000 pixels.",
    largeImageWarning:"This image is very large. Conversion may be slow or your browser may become unresponsive. Do you want to continue?",
    invalidTarget:"Target file size must be between 1 and 100000 KB.",
    targetPngNote:"PNG quality settings do not reduce file size, so its dimensions are reduced instead.",
    targetQualityNote:"JPG/WebP/AVIF quality was adjusted to reach the target size.",
    targetAndDimensionsNote:"Quality and image dimensions were adjusted to reach the target size.",
    gifWorkerError:"A worker error occurred while converting the GIF. Please try again.",
    avifLoadError:"The AVIF image could not be decoded. The file may be damaged or the AVIF component failed to load.",
      heicLoadError:"The HEIC/HEIF image could not be decoded. The file may be damaged or the HEIC component failed to load.",
      heicDecodeWarning:"HEIC/HEIF dimensions cannot be read before decoding. Opening the image may use much more memory than its file size and may be slow. Do you want to continue?",
    tiffLoadError:"The TIFF/TIF image could not be opened. The file may be damaged or the TIFF component failed to load.",
    tiffLargeImageWarning:"This TIFF image is very large ({width} × {height} pixels). Decoding may use substantial memory and slow down your browser. Do you want to continue?",
    avifConversionError:"AVIF conversion failed. Check your internet connection and try again.",
    heicConversionError:"HEIC conversion failed. Check your internet connection and try again.",
    tiffConversionError:"TIFF conversion failed. The file may be too large or the TIFF component failed to load.",
    urlPlaceholder:"Paste an image URL...",
    loadUrl:"Load from URL",
    urlRequired:"Please enter an image address.",
    urlLoadError:"Could not load the image. The address may be invalid or the site may block external access.",
    urlImageName:"internet-image"
  }
};

let language = localStorage.getItem("ebToolsLanguage") === "en" ? "en" : "tr";
let sourceImage = null;
let sourceUrl = null;
let pendingSvgFile = null;
let pendingSvgImage = null;
let svgDimensionsChoiceResolver = null;
let previewUrl = null;
let originalWidth = 0;
let originalHeight = 0;
let outputUrl = null;
let originalFileSize = 0;
let resultFileSize = 0;

function createAvifWorkerClient() {
  const worker = new Worker(new URL("avif.worker.js", document.baseURI), {
    type: "module"
  });

  return {
    request(type, payload, transfer = []) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          if (event.data.ok) {
            resolve(event.data);
            return;
          }

          const error = new Error(event.data.message || "AVIF operation failed");
          error.code = event.data.code || "AVIF_WORKER_ERROR";
          reject(error);
        };
        worker.onerror = event => {
          event.preventDefault();
          const error = new Error("AVIF worker failed");
          error.code = "AVIF_WORKER_ERROR";
          reject(error);
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
  const worker = new Worker(new URL("heic.worker.js", document.baseURI), {
    type: "module"
  });

  return {
    decode(file) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          if (event.data.ok && event.data.blob instanceof Blob) {
            resolve(event.data.blob);
            return;
          }

          reject(new Error(event.data.message || "HEIC worker failed"));
        };
        worker.onerror = event => {
          event.preventDefault();
          reject(new Error("HEIC worker failed"));
        };
        worker.onmessageerror = () => reject(new Error("HEIC worker message failed"));
        worker.postMessage({ type: "decode", file });
      });
    },
    terminate() {
      worker.terminate();
    }
  };
}

function createHeicEncoderWorkerClient() {
  const worker = new Worker(new URL("heic-encoder.worker.js", document.baseURI), {
    type: "module"
  });

  return {
    encode(pixels, width, height) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          if (event.data.ok && event.data.buffer instanceof ArrayBuffer) {
            resolve(event.data.buffer);
            return;
          }
          reject(new Error(event.data.message || "HEIC encoder worker failed"));
        };
        worker.onerror = event => {
          event.preventDefault();
          reject(new Error("HEIC encoder worker failed"));
        };
        worker.onmessageerror = () => reject(new Error("HEIC encoder worker message failed"));
        worker.postMessage({ type: "encode", pixels, width, height }, [pixels]);
      });
    },
    terminate() {
      worker.terminate();
    }
  };
}

function createTiffWorkerClient() {
  const worker = new Worker(new URL("tiff.worker.js", document.baseURI));

  return {
    decode(file, confirmLargeImage) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          const data = event.data;
          if (data.confirmationRequired) {
            const message = translations[language].tiffLargeImageWarning
              .replace("{width}", data.width)
              .replace("{height}", data.height);
            worker.postMessage({ type: "continue", accepted: confirmLargeImage(message) });
            return;
          }

          if (data.ok) {
            resolve(data.cancelled ? null : data);
            return;
          }

          reject(new Error(data.message || "TIFF worker failed"));
        };
        worker.onerror = event => {
          event.preventDefault();
          reject(new Error("TIFF worker failed"));
        };
        worker.onmessageerror = () => reject(new Error("TIFF worker message failed"));
        worker.postMessage({ type: "decode", file });
      });
    },
    encode(pixels, width, height) {
      return new Promise((resolve, reject) => {
        worker.onmessage = event => {
          if (event.data.ok && event.data.buffer instanceof ArrayBuffer) {
            resolve(event.data.buffer);
            return;
          }
          reject(new Error(event.data.message || "TIFF encoder worker failed"));
        };
        worker.onerror = event => {
          event.preventDefault();
          reject(new Error("TIFF encoder worker failed"));
        };
        worker.onmessageerror = () => reject(new Error("TIFF encoder message failed"));
        worker.postMessage({ type: "encode", pixels, width, height }, [pixels]);
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

  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const rowSize = Math.floor((width * 3 + 3) / 4) * 4;
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const output = new Uint8Array(buffer);

  // BMP dosya başlığı
  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4D);
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);

  // DIB başlığı
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, imageSize, true);

  // Piksel verileri (BMP: BGR, alttan üste)
  for (let y = 0; y < height; y++) {
    const targetY = height - 1 - y;
    const rowStart = 54 + targetY * rowSize;

    for (let x = 0; x < width; x++) {
      const sourceIndex = (y * width + x) * 4;
      const targetIndex = rowStart + x * 3;

      const alpha = pixels[sourceIndex + 3] / 255;

      output[targetIndex] =
        Math.round(pixels[sourceIndex + 2] * alpha + 255 * (1 - alpha));

      output[targetIndex + 1] =
        Math.round(pixels[sourceIndex + 1] * alpha + 255 * (1 - alpha));

      output[targetIndex + 2] =
        Math.round(pixels[sourceIndex] * alpha + 255 * (1 - alpha));
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

    const imageSize = 40 + xorSize + andSize;
    const buffer = new ArrayBuffer(imageSize);
    const view = new DataView(buffer);
    const output = new Uint8Array(buffer);

    // Bitmap başlığı
    view.setUint32(0, 40, true);
    view.setInt32(4, size, true);
    view.setInt32(8, size * 2, true);
    view.setUint16(12, 1, true);
    view.setUint16(14, 32, true);
    view.setUint32(16, 0, true);
    view.setUint32(20, xorSize + andSize, true);

    // Piksel verileri (BGRA, alttan üste)
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

    // Şeffaflık maskesi
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

  // ICO dosya başlığı ve dizini
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
    view.setUint8(entry + 2, 0);
    view.setUint8(entry + 3, 0);
    view.setUint16(entry + 4, 1, true);
    view.setUint16(entry + 6, 32, true);
    view.setUint32(entry + 8, image.length, true);
    view.setUint32(entry + 12, offset, true);

    output.set(image, offset);
    offset += image.length;
  }

  return new Blob([result], { type: "image/x-icon" });
}
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function updateResultSizeInfo() {
  const t = translations[language];

  if (!resultFileSize) {
    $("resultSizeInfo").textContent = "";
    return;
  }

  const difference = resultFileSize - originalFileSize;

  if (difference === 0) {
    $("resultSizeInfo").textContent =
      t.resultSize + ": " + formatBytes(resultFileSize) +
      " · " + t.sizeUnchanged;
    return;
  }

  const percentage = originalFileSize > 0
    ? ((Math.abs(difference) / originalFileSize) * 100).toFixed(1)
    : "0.0";

  $("resultSizeInfo").textContent =
    t.resultSize + ": " + formatBytes(resultFileSize) +
    " · " + t.savedSize + ": " + formatBytes(Math.abs(difference)) +
    " " + (difference > 0 ? t.sizeIncreased : t.sizeDecreased) +
    " · " + t.reduction + ": " +
    (difference > 0 ? "+" : "-") + percentage + "%";
}

function updateQualityControl() {
  const t = translations[language];
  const format = $("formatSelect").value;
  const qualityNote = format === "image/heic"
    ? t.heicQualityNote
    : format === "image/tiff"
      ? t.tiffQualityNote
      : null;
  $("qualityInput").disabled = Boolean(qualityNote);
  $("qualityValue").textContent = qualityNote ? "—" : $("qualityInput").value + "%";
  $("qualityNote").textContent = qualityNote || t.qualityNote;
}

function setLanguage(lang) {
  language = lang;
  localStorage.setItem("ebToolsLanguage", lang);
  document.documentElement.lang = lang;
  const t = translations[lang];

  document.title = t.browserTitle;
  $("pageTitle").textContent = t.title;
  $("subtitle").textContent = t.subtitle;
  $("svgDimensionsDialogTitle").textContent = t.svgDimensionsTitle;
  $("svgDimensionsDialogMessage").textContent = t.svgDimensionsPrompt;
  $("svgDimensionsSetButton").textContent = t.svgSetDimensions;
  $("svgDimensionsCancelButton").textContent = t.cancel;
  $("backLink").textContent = t.back;
  $("chooseText").textContent = t.choose;
  $("supportedText").textContent = t.supported;
  $("preview").alt = t.previewAlt;
  $("widthLabel").textContent = t.width;
  $("widthInput").placeholder = t.widthPlaceholder;
  $("heightLabel").textContent = t.height;
  $("heightInput").placeholder = t.heightPlaceholder;
  $("ratioLabel").textContent = t.ratio;
  $("resetDimensionsButton").textContent = t.resetDimensions;
  $("formatLabel").textContent = t.format;
  $("qualityLabel").textContent = t.quality;
  updateQualityControl();
  $("targetSizeLabel").textContent = t.targetSize;
  $("targetSizeInput").placeholder = t.targetSizePlaceholder;
  $("targetSizeNote").textContent = t.targetNote;
  $("imageUrl").placeholder = t.urlPlaceholder;
  $("loadUrlBtn").textContent = t.loadUrl;
  $("convertButton").textContent = t.convert;
  $("downloadLink").textContent = t.download;
  $("footerText").textContent = t.footer;
  $("trButton").classList.toggle("active", lang === "tr");
  $("enButton").classList.toggle("active", lang === "en");

  if (originalFileSize > 0) {
    $("fileSizeInfo").textContent =
      t.originalSize + ": " + formatBytes(originalFileSize);
  }

  updateResultSizeInfo();

  if (sourceImage && !$("convertButton").disabled) {
    $("status").textContent = t.ready;
  }
}

$("trButton").addEventListener("click", () => setLanguage("tr"));
$("resetDimensionsButton").addEventListener("click", () => {
  if (!sourceImage) return;

  $("widthInput").value = originalWidth;
  $("heightInput").value = originalHeight;

  clearOutput();
  $("status").textContent = translations[language].ready;
});
$("enButton").addEventListener("click", () => setLanguage("en"));

function clearOutput() {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  outputUrl = null;
  resultFileSize = 0;
  $("resultSizeInfo").textContent = "";
  $("downloadLink").removeAttribute("href");
  $("downloadLink").style.display = "none";
}

function resetImage() {
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  sourceUrl = null;
  previewUrl = null;
  sourceImage = null;
  pendingSvgFile = null;
  pendingSvgImage = null;
  originalWidth = 0;
  originalHeight = 0;
  originalFileSize = 0;
  resultFileSize = 0;
  $("fileSizeInfo").textContent = "";
  $("resultSizeInfo").textContent = "";
  $("preview").removeAttribute("src");
  $("preview").removeAttribute("width");
  $("preview").removeAttribute("height");
  $("preview").style.display = "none";
  $("fileName").textContent = "";
  $("widthInput").value = "";
  $("heightInput").value = "";
  $("convertButton").disabled = true;
  $("resetDimensionsButton").disabled = true;
  clearOutput();
}

function requestSvgDimensionsChoice() {
  return new Promise(resolve => {
    svgDimensionsChoiceResolver = resolve;
    $("svgDimensionsDialog").showModal();
  });
}

function updatePendingSvgDimensions() {
  if (!pendingSvgFile || !pendingSvgImage) return;

  const width = Number($("widthInput").value);
  const height = Number($("heightInput").value);
  const valid = Number.isInteger(width) && Number.isInteger(height) &&
    width >= 1 && height >= 1;

  if (!valid) {
    sourceImage = null;
    originalWidth = 0;
    originalHeight = 0;
    $("convertButton").disabled = true;
    $("resetDimensionsButton").disabled = true;
    $("status").textContent = translations[language].svgEnterDimensions;
    return;
  }

  sourceImage = pendingSvgImage;
  originalWidth = width;
  originalHeight = height;
  $("preview").width = width;
  $("preview").height = height;
  $("fileName").textContent =
    pendingSvgFile.name + " · " + width + " × " + height + " px";
  $("convertButton").disabled = false;
  $("status").textContent = translations[language].ready;
}

function parseSvgLength(value) {
  if (!value) return null;

  const match = String(value).trim().match(/^([+]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(px|in|cm|mm|pt|pc)?$/i);
  if (!match) return null;

  const number = Number(match[1]);
  const unit = (match[2] || "px").toLowerCase();
  const pixelsPerUnit = { px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4, pt: 96 / 72, pc: 16 };
  const pixels = number * pixelsPerUnit[unit];
  return Number.isFinite(pixels) && pixels > 0 ? pixels : null;
}

async function getSvgDimensions(file) {
  const text = await file.text();
  const document = new DOMParser().parseFromString(text, "image/svg+xml");
  const root = document.documentElement;

  if (document.getElementsByTagName("parsererror").length ||
      !root || root.localName.toLowerCase() !== "svg") {
    const error = new Error("Invalid SVG document");
    error.code = "SVG_DIMENSIONS_ERROR";
    throw error;
  }

  let width = parseSvgLength(root.getAttribute("width"));
  let height = parseSvgLength(root.getAttribute("height"));
  const viewBox = (root.getAttribute("viewBox") || "")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const hasViewBox = viewBox.length === 4 &&
    viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0;

  if ((!width || !height) && hasViewBox) {
    if (width) height = width * viewBox[3] / viewBox[2];
    else if (height) width = height * viewBox[2] / viewBox[3];
    else {
      width = viewBox[2];
      height = viewBox[3];
    }
  }

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    const error = new Error("SVG dimensions or aspect ratio are unavailable");
    error.code = "SVG_DIMENSIONS_ERROR";
    throw error;
  }

  return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
}

async function loadImageFile(file) {
  if (!file) {
    resetImage();
    $("status").textContent = "";
    return;
  }

  const fileExtension = file.name.split(".").pop().toLowerCase();
  const isSvgFile = fileExtension === "svg" || file.type === "image/svg+xml";

  if (!isSvgFile) resetImage();
  $("status").textContent = "";

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/heic",
    "image/heif",
    "image/tiff",
    "image/x-tiff",
    "image/svg+xml",
    "image/bmp",
    "image/x-ms-bmp",
    "image/gif",
    "image/x-icon",
    "image/vnd.microsoft.icon"
  ];

  const allowedExtensions = ["png", "jpg", "jpeg", "webp", "avif", "heic", "heif", "tif", "tiff", "svg", "bmp", "gif", "ico"];

if (!allowed.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    $("status").textContent = translations[language].badFile;
    $("fileInput").value = "";
    return;
  }

  let svgDimensions = null;

  if (isSvgFile) {
    try {
      svgDimensions = await getSvgDimensions(file);
    } catch (error) {
      if (error.code !== "SVG_DIMENSIONS_ERROR") {
        resetImage();
        $("fileInput").value = "";
        $("status").textContent = translations[language].svgLoadError;
        return;
      }

      const setDimensions = await requestSvgDimensionsChoice();
      if (!setDimensions) {
        $("fileInput").value = "";
        return;
      }

      resetImage();
      pendingSvgFile = file;
      $("status").textContent = translations[language].svgEnterDimensions;
    }

    if (svgDimensions) resetImage();
  }

  const isTiffFile = ["tif", "tiff"].includes(fileExtension) ||
    file.type === "image/tiff" || file.type === "image/x-tiff";

  if (isTiffFile) {
    const client = createTiffWorkerClient();
    client.decode(file, message => window.confirm(message))
      .then(async result => {
        if (!result) return;

        const canvas = document.createElement("canvas");
        canvas.width = result.width;
        canvas.height = result.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");
        context.putImageData(
          new ImageData(new Uint8ClampedArray(result.pixels), result.width, result.height),
          0,
          0
        );

        sourceImage = canvas;
        originalWidth = result.width;
        originalHeight = result.height;
        originalFileSize = file.size;
        previewUrl = URL.createObjectURL(await new Promise((resolve, reject) =>
          canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("TIFF preview failed")), "image/png")
        ));
        $("fileSizeInfo").textContent =
          translations[language].originalSize + ": " + formatBytes(file.size);
        $("preview").src = previewUrl;
        $("preview").style.display = "inline-block";
        $("fileName").textContent =
          file.name + " · " + originalWidth + " × " + originalHeight + " px";
        $("widthInput").value = originalWidth;
        $("heightInput").value = originalHeight;
        $("convertButton").disabled = false;
        $("resetDimensionsButton").disabled = false;
        $("status").textContent = translations[language].ready;
      })
      .catch(error => {
        console.error("TIFF/TIF decode error:", error);
        resetImage();
        $("fileInput").value = "";
        $("status").textContent = translations[language].tiffLoadError;
      })
      .finally(() => client.terminate());
    return;
  }

  sourceUrl = URL.createObjectURL(file);

  if (["heic", "heif"].includes(fileExtension) ||
      file.type === "image/heic" || file.type === "image/heif") {
    if (!window.confirm(translations[language].heicDecodeWarning)) {
      resetImage();
      $("fileInput").value = "";
      return;
    }

    const client = createHeicWorkerClient();
    client.decode(file)
      .then(blob => new Promise((resolve, reject) => {
        previewUrl = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("HEIC preview failed"));
        image.src = previewUrl;
      }))
      .then(image => {
        sourceImage = image;
        originalWidth = image.naturalWidth;
        originalHeight = image.naturalHeight;
        originalFileSize = file.size;
        $("fileSizeInfo").textContent =
          translations[language].originalSize + ": " + formatBytes(file.size);
        $("preview").src = previewUrl;
        $("preview").style.display = "inline-block";
        $("fileName").textContent =
          file.name + " · " + originalWidth + " × " + originalHeight + " px";
        $("widthInput").value = originalWidth;
        $("heightInput").value = originalHeight;
        $("convertButton").disabled = false;
        $("resetDimensionsButton").disabled = false;
        $("status").textContent = translations[language].ready;
      })
      .catch(error => {
        console.error("HEIC/HEIF decode error:", error);
        resetImage();
        $("fileInput").value = "";
        $("status").textContent = translations[language].heicLoadError;
      })
      .finally(() => client.terminate());
    return;
  }

  if (file.type === "image/avif" || fileExtension === "avif") {
    const client = createAvifWorkerClient();
    file.arrayBuffer()
      .then(buffer => client.request("decode", { buffer }, [buffer]))
      .then(async result => {
        const canvas = document.createElement("canvas");
        canvas.width = result.width;
        canvas.height = result.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");

        context.putImageData(
          new ImageData(new Uint8ClampedArray(result.pixels), result.width, result.height),
          0,
          0
        );

        sourceImage = canvas;
        originalWidth = result.width;
        originalHeight = result.height;
        originalFileSize = file.size;
        previewUrl = URL.createObjectURL(await new Promise(resolve =>
          canvas.toBlob(resolve, "image/png")
        ));

        $("fileSizeInfo").textContent =
          translations[language].originalSize + ": " + formatBytes(file.size);
        $("preview").src = previewUrl;
        $("preview").style.display = "inline-block";
        $("fileName").textContent =
          file.name + " · " + originalWidth + " × " + originalHeight + " px";
        $("widthInput").value = originalWidth;
        $("heightInput").value = originalHeight;
        $("convertButton").disabled = false;
        $("resetDimensionsButton").disabled = false;
        $("status").textContent = translations[language].ready;
      })
      .catch(error => {
        console.error("AVIF çözme hatası:", error);
        resetImage();
        $("fileInput").value = "";
        $("status").textContent = translations[language].avifLoadError;
      })
      .finally(() => client.terminate());
    return;
  }

  const image = new Image();

  image.onload = () => {
    if (pendingSvgFile === file) {
      pendingSvgImage = image;
      originalFileSize = file.size;
      $("fileSizeInfo").textContent =
        translations[language].originalSize + ": " + formatBytes(file.size);
      $("preview").src = sourceUrl;
      $("preview").style.display = "inline-block";
      $("fileName").textContent = file.name;
      updatePendingSvgDimensions();
      return;
    }

    sourceImage = image;
    originalWidth = svgDimensions ? svgDimensions.width : image.naturalWidth;
    originalHeight = svgDimensions ? svgDimensions.height : image.naturalHeight;
    originalFileSize = file.size;

    $("fileSizeInfo").textContent =
      translations[language].originalSize + ": " + formatBytes(file.size);

    $("preview").src = sourceUrl;
    $("preview").style.display = "inline-block";

    $("fileName").textContent =
      file.name + " · " + originalWidth + " × " + originalHeight + " px";

    $("widthInput").value = originalWidth;
    $("heightInput").value = originalHeight;
    $("convertButton").disabled = false;
    $("resetDimensionsButton").disabled = false;
    $("status").textContent = translations[language].ready;
  };

  image.onerror = () => {
    resetImage();
    $("fileInput").value = "";
    $("status").textContent = isSvgFile
      ? translations[language].svgLoadError
      : translations[language].loadError;
  };

  image.src = sourceUrl;
}

$("fileInput").addEventListener("change", () => {
  loadImageFile($("fileInput").files[0]);
});

$("svgDimensionsSetButton").addEventListener("click", () => {
  $("svgDimensionsDialog").close("set-dimensions");
});

$("svgDimensionsCancelButton").addEventListener("click", () => {
  $("svgDimensionsDialog").close("cancel");
});

$("svgDimensionsDialog").addEventListener("close", () => {
  if (!svgDimensionsChoiceResolver) return;
  const resolve = svgDimensionsChoiceResolver;
  svgDimensionsChoiceResolver = null;
  resolve($("svgDimensionsDialog").returnValue === "set-dimensions");
});

const dropzone = document.querySelector(".dropzone");
let dragDepth = 0;

dropzone.addEventListener("dragenter", event => {
  if (!event.dataTransfer.types.includes("Files")) return;

  event.preventDefault();
  dragDepth++;
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragover", event => {
  if (!event.dataTransfer.types.includes("Files")) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

dropzone.addEventListener("dragleave", event => {
  if (!event.dataTransfer.types.includes("Files")) return;

  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", event => {
  if (!event.dataTransfer.files.length) return;

  event.preventDefault();
  dragDepth = 0;
  dropzone.classList.remove("dragover");
  loadImageFile(event.dataTransfer.files[0]);
});

$("loadUrlBtn").addEventListener("click", async () => {
  const url = $("imageUrl").value.trim();

  $("urlError").textContent = "";
  $("status").textContent = "";

  if (!url) {
    $("urlError").textContent = translations[language].urlRequired;
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Image request failed");
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error("URL response is not an image");
    }

    const extension = blob.type === "image/jpeg" ? "jpg" :
                      blob.type === "image/png" ? "png" :
                      blob.type === "image/webp" ? "webp" :
                      blob.type === "image/svg+xml" ? "svg" :
                      blob.type === "image/avif" ? "avif" :
                      blob.type === "image/tiff" || blob.type === "image/x-tiff" ? "tif" :
                      blob.type === "image/bmp" ? "bmp" :
                      blob.type === "image/gif" ? "gif" : "img";

    let fileName = translations[language].urlImageName;

try {
  const urlPath = new URL(url).pathname;
  const lastPart = decodeURIComponent(urlPath.split("/").pop());

  if (lastPart && lastPart.includes(".")) {
    fileName = lastPart.replace(/\.[^.]+$/, "");
  }
} catch (error) {}

const file = new File([blob], fileName + "." + extension, {
  type: blob.type
});

    loadImageFile(file);

  } catch (error) {
    $("urlError").textContent = translations[language].urlLoadError;
  }
});
$("widthInput").addEventListener("input", () => {
  clearOutput();

  if (pendingSvgFile) {
    if ($("keepRatio").checked && originalWidth && originalHeight && $("widthInput").value) {
      const width = Number($("widthInput").value);
      if (width > 0) {
        $("heightInput").value = Math.round(width * originalHeight / originalWidth);
      }
    }
    updatePendingSvgDimensions();
    return;
  }

  if (!$("keepRatio").checked || !originalWidth || !$("widthInput").value) return;
  const width = Number($("widthInput").value);
  if (width > 0) {
    $("heightInput").value = Math.round(width * originalHeight / originalWidth);
  }
});

$("heightInput").addEventListener("input", () => {
  clearOutput();

  if (pendingSvgFile) {
    if ($("keepRatio").checked && originalWidth && originalHeight && $("heightInput").value) {
      const height = Number($("heightInput").value);
      if (height > 0) {
        $("widthInput").value = Math.round(height * originalWidth / originalHeight);
      }
    }
    updatePendingSvgDimensions();
    return;
  }

  if (!$("keepRatio").checked || !originalHeight || !$("heightInput").value) return;
  const height = Number($("heightInput").value);
  if (height > 0) {
    $("widthInput").value = Math.round(height * originalWidth / originalHeight);
  }
});

$("qualityInput").addEventListener("input", () => {
  $("qualityValue").textContent = $("qualityInput").value + "%";
  clearOutput();
});

$("formatSelect").addEventListener("change", () => {
  clearOutput();
  updateQualityControl();
});
$("targetSizeInput").addEventListener("input", clearOutput);

$("convertButton").addEventListener("click", async () => {
  const t = translations[language];

  if (!sourceImage) {
    $("status").textContent = t.selectFile;
    return;
  }

  let width = Number($("widthInput").value);
  let height = Number($("heightInput").value);
  const targetText = $("targetSizeInput").value.trim();
  const targetKB = Number(targetText);
  const hasTarget = targetText !== "";
  const format = $("formatSelect").value;

  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1 || width > 12000 || height > 12000) {
    $("status").textContent = t.tooLarge;
    return;
  }

  if (hasTarget &&
      (!Number.isFinite(targetKB) || targetKB < 1 || targetKB > 100000)) {
    $("status").textContent = t.invalidTarget;
    return;
  }

  if (width * height > 40_000_000 && !window.confirm(t.largeImageWarning)) {
    return;
  }

  clearOutput();

  const targetBytes = targetKB * 1024;
  const selectedQuality = Number($("qualityInput").value) / 100;
  let quality = selectedQuality;
  let blob = null;
  let resized = false;
  let qualityChanged = false;
  let avifClient = null;
  let heicEncoderClient = null;
  let tiffClient = null;

  $("convertButton").disabled = true;
  $("status").textContent = t.converting;

  function makeBlob(canvas, q) {
  if (format === "image/avif") {
    if (!avifClient) avifClient = createAvifWorkerClient();
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const buffer = pixels.data.buffer;

    return avifClient.request("encode", {
      pixels: buffer,
      width: canvas.width,
      height: canvas.height,
      quality: q
    }, [buffer]).then(result =>
      new Blob([result.buffer], { type: "image/avif" })
    );
  }

  if (format === "image/heic") {
    if (!heicEncoderClient) heicEncoderClient = createHeicEncoderWorkerClient();
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const buffer = pixels.data.buffer;
    return heicEncoderClient.encode(buffer, canvas.width, canvas.height).then(encodedBuffer =>
      new Blob([encodedBuffer], { type: "image/heic" })
    );
  }

  if (format === "image/tiff") {
    if (!tiffClient) tiffClient = createTiffWorkerClient();
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const buffer = pixels.data.buffer;
    return tiffClient.encode(buffer, canvas.width, canvas.height).then(encodedBuffer =>
      new Blob([encodedBuffer], { type: "image/tiff" })
    );
  }

  if (format === "image/gif") {
    return new Promise((resolve, reject) => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: "gif.worker.js"
      });
      let settled = false;

      gif.addFrame(canvas, {
        
        delay: 100
      });

      gif.on("finished", blob => {
        settled = true;
        resolve(blob);
      });

      gif.render();

      const handleWorkerError = event => {
        if (settled) return;
        settled = true;
        event.preventDefault();

        try {
          gif.abort();
        } catch (error) {}

        const workerError = new Error("GIF worker failed");
        workerError.code = "GIF_WORKER_ERROR";
        reject(workerError);
      };

      gif.activeWorkers.forEach(worker => {
        worker.addEventListener("error", handleWorkerError);
        worker.addEventListener("messageerror", handleWorkerError);
      });
    });
  }

  if (format === "image/bmp") {
    return Promise.resolve(canvasToBmp(canvas));
  }

  if (format === "image/x-icon") {
    return Promise.resolve(canvasToIco(canvas));
  }

  return new Promise(resolve => canvas.toBlob(resolve, format, q));
}

  async function createBlobAtSize(w, h, q) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");

    if (format === "image/jpeg" || format === "image/bmp") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, w, h);
    }

    context.drawImage(sourceImage, 0, 0, w, h);

    const result = await makeBlob(canvas, q);
    if (!result || result.type !== format) {
  throw new Error("Image conversion failed");

    }

    return result;
  }

  try {
    blob = await createBlobAtSize(width, height, quality);

    // JPG/WebP: önce kaliteyi azalt.
    if (hasTarget &&
    (format === "image/jpeg" || format === "image/webp" || format === "image/avif") &&
    blob.size > targetBytes) {
      while (blob.size > targetBytes && quality > 0.1) {
        quality = Math.max(0.1, Math.round((quality - 0.1) * 10) / 10);
        const nextBlob = await createBlobAtSize(width, height, quality);

        if (nextBlob.size >= blob.size && quality <= 0.1) {
          blob = nextBlob;
          break;
        }

        blob = nextBlob;
        qualityChanged = true;
      }
    }

    // Hedef hâlâ aşılmışsa tüm formatlarda ölçüleri oranlı küçült.
    if (hasTarget && blob.size > targetBytes && (width > 1 || height > 1)) {
      let attempts = 0;

      while (blob.size > targetBytes && attempts < 40 &&
             (width > 1 || height > 1)) {
        const scale = Math.max(
          0.65,
          Math.min(0.9, Math.sqrt(targetBytes / blob.size) * 0.9)
        );

        const nextWidth = Math.max(1, Math.floor(width * scale));
        const nextHeight = Math.max(1, Math.floor(height * scale));

        if (nextWidth === width && nextHeight === height) break;

        width = nextWidth;
        height = nextHeight;
        blob = await createBlobAtSize(width, height, quality);
        resized = true;
        attempts++;
      }
    }

    outputUrl = URL.createObjectURL(blob);
    resultFileSize = blob.size;

    const extensions = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/tiff": "tif",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/x-icon": "ico"
};

    const originalName = $("fileName").textContent
  .split(" · ")[0]
  .replace(/\.[^.]+$/, "");

    $("downloadLink").href = outputUrl;
    $("downloadLink").download =
      originalName + "-ebtools." + extensions[format];
    $("downloadLink").style.display = "block";

    // Otomatik küçültme yapıldıysa gerçekleşen son ölçüleri göster.
    if (resized) {
      $("widthInput").value = width;
      $("heightInput").value = height;
    }

    updateResultSizeInfo();

    if (hasTarget && blob.size <= targetBytes) {
      if (resized) {
        $("status").textContent =
          t.targetReachedResized + " " + width + " × " + height + " px.";
      } else if (qualityChanged) {
        $("status").textContent = t.targetReached + " " + t.targetQualityNote;
      } else {
        $("status").textContent = t.targetReached;
      }
    } else if (hasTarget && blob.size > targetBytes) {
      if (resized) {
        $("status").textContent =
          t.targetMissedResized + " " + width + " × " + height + " px.";
      } else {
        $("status").textContent = t.targetMissed;
      }

      if (format === "image/png") {
        $("status").textContent += " " + t.targetPngNote;
      }
    } else {
      $("status").textContent = t.success;
    }
  } catch (error) {
  console.error("Dönüştürme hatası:", error);
  $("status").textContent = format === "image/avif"
    ? t.avifConversionError
    : format === "image/heic"
      ? t.heicConversionError
      : format === "image/tiff"
        ? t.tiffConversionError
        : error.code === "GIF_WORKER_ERROR"
          ? t.gifWorkerError
          : t.failed;
} finally {
    if (avifClient) avifClient.terminate();
    if (heicEncoderClient) heicEncoderClient.terminate();
    if (tiffClient) tiffClient.terminate();
    $("convertButton").disabled = !sourceImage;
  }
});

setLanguage(language);
