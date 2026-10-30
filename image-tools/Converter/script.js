
const $ = id => document.getElementById(id);

const translations = {
  tr: {
    title:"Görsel Dönüştürücü",
    subtitle:"Görselini seç, formatını belirle ve dönüştür. İşlemler cihazında yapılır.",
    back:"← Ana sayfa",
    choose:"Görsel seçmek için tıkla",
    supported:"PNG, JPG, WebP, BMP, GIF ve ICO · GIF dosyaları tek kare olarak dönüştürülür",
    width:"Genişlik (px)",
    height:"Yükseklik (px)",
    ratio:"En-boy oranını koru",
    resetDimensions:"Orijinal ölçülere dön",
    format:"Çıktı formatı",
    quality:"Görüntü kalitesi",
    qualityNote:"Kalite ayarı JPG ve WebP için geçerlidir. PNG, BMP, GIF ve ICO bu ayardan etkilenmez.",
    targetSize:"Hedef dosya boyutu (KB) — isteğe bağlı",
    targetNote:"Hedef aşılırsa JPG/WebP'de önce kalite, gerekirse piksel ölçüleri ayarlanır. PNG, BMP, GIF ve ICO'da ölçüler ayarlanır. Tam hedef garanti değildir.",
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
    badFile:"Bu dosya desteklenmiyor. PNG, JPG, WebP, BMP, GIF veya ICO seç.",
    loadError:"Görsel açılamadı. Başka bir dosya deneyebilirsin.",
    ready:"Görsel hazır. Dönüştürebilirsin.",
    success:"Dönüştürme tamamlandı.",
    failed:"Dönüştürme başarısız oldu. Başka bir format dene.",
    tooLarge:"Ölçüler 1 ile 12000 piksel arasında tam sayı olmalıdır.",
    invalidTarget:"Hedef dosya boyutu 1 ile 100000 KB arasında olmalıdır.",
    targetPngNote:"PNG'de kalite ayarı dosya boyutunu düşürmez; bu nedenle piksel ölçüleri küçültülür.",
    targetQualityNote:"Hedef boyuta ulaşmak için JPG/WebP kalitesi ayarlandı.",
    targetAndDimensionsNote:"Hedef boyuta ulaşmak için kalite ve piksel ölçüleri ayarlandı."
  },
  en: {
    title:"Image Converter",
    subtitle:"Choose an image, select a format and convert it. Processing happens on your device.",
    back:"← Home",
    choose:"Click to choose an image",
    supported:"PNG, JPG, WebP, BMP, GIF and ICO · GIF files are converted as a single frame",
    width:"Width (px)",
    height:"Height (px)",
    ratio:"Keep aspect ratio",
    resetDimensions:"Restore original dimensions",
    format:"Output format",
    quality:"Image quality",
    qualityNote:"Quality setting applies to JPG and WebP. PNG, BMP, GIF and ICO are not affected by this setting.",
    targetSize:"Target file size (KB) — optional",
    targetNote:"If the target is exceeded, JPG/WebP quality is reduced first, then dimensions if needed. PNG, BMP, GIF and ICO dimensions are adjusted. Exact size is not guaranteed.",
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
    badFile:"Unsupported file. Choose PNG, JPG, WebP, BMP, GIF or ICO.",
    loadError:"Could not open the image. Try another file.",
    ready:"Image ready. You can convert it.",
    success:"Conversion completed.",
    failed:"Conversion failed. Try another format.",
    tooLarge:"Dimensions must be whole numbers between 1 and 12000 pixels.",
    invalidTarget:"Target file size must be between 1 and 100000 KB.",
    targetPngNote:"PNG quality settings do not reduce file size, so its dimensions are reduced instead.",
    targetQualityNote:"JPG/WebP quality was adjusted to reach the target size.",
    targetAndDimensionsNote:"Quality and image dimensions were adjusted to reach the target size."
  }
};

let language = localStorage.getItem("ebToolsLanguage") === "en" ? "en" : "tr";
let sourceImage = null;
let sourceUrl = null;
let originalWidth = 0;
let originalHeight = 0;
let outputUrl = null;
let originalFileSize = 0;
let resultFileSize = 0;
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

function setLanguage(lang) {
  language = lang;
  localStorage.setItem("ebToolsLanguage", lang);
  document.documentElement.lang = lang;
  const t = translations[lang];

  $("pageTitle").textContent = t.title;
  $("subtitle").textContent = t.subtitle;
  $("backLink").textContent = t.back;
  $("chooseText").textContent = t.choose;
  $("supportedText").textContent = t.supported;
  $("widthLabel").textContent = t.width;
  $("heightLabel").textContent = t.height;
  $("ratioLabel").textContent = t.ratio;
  $("resetDimensionsButton").textContent = t.resetDimensions;
  $("formatLabel").textContent = t.format;
  $("qualityLabel").textContent = t.quality;
  $("qualityNote").textContent = t.qualityNote;
  $("targetSizeLabel").textContent = t.targetSize;
  $("targetSizeNote").textContent = t.targetNote;
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
  sourceUrl = null;
  sourceImage = null;
  originalWidth = 0;
  originalHeight = 0;
  originalFileSize = 0;
  resultFileSize = 0;
  $("fileSizeInfo").textContent = "";
  $("resultSizeInfo").textContent = "";
  $("preview").removeAttribute("src");
  $("preview").style.display = "none";
  $("fileName").textContent = "";
  $("widthInput").value = "";
  $("heightInput").value = "";
  $("convertButton").disabled = true;
  $("resetDimensionsButton").disabled = true;
  clearOutput();
}

function loadImageFile(file) {
  resetImage();
  $("status").textContent = "";

  if (!file) return;

  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/bmp",
    "image/x-ms-bmp",
    "image/gif",
    "image/x-icon",
    "image/vnd.microsoft.icon"
  ];

  const fileExtension = file.name.split(".").pop().toLowerCase();

  const allowedExtensions = ["png", "jpg", "jpeg", "webp", "bmp", "gif", "ico"];

if (!allowed.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    $("status").textContent = translations[language].badFile;
    $("fileInput").value = "";
    return;
  }

  sourceUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    sourceImage = image;
    originalWidth = image.naturalWidth;
    originalHeight = image.naturalHeight;
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
    $("status").textContent = translations[language].loadError;
  };

  image.src = sourceUrl;
}

$("fileInput").addEventListener("change", () => {
  loadImageFile($("fileInput").files[0]);
});
$("loadUrlBtn").addEventListener("click", async () => {
  const url = $("imageUrl").value.trim();

  $("urlError").textContent = "";
  $("status").textContent = "";

  if (!url) {
    $("urlError").textContent = "Lütfen bir görsel adresi gir.";
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Görsel yüklenemedi.");
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      throw new Error("Bu adres bir görsel içermiyor.");
    }

    const extension = blob.type === "image/jpeg" ? "jpg" :
                      blob.type === "image/png" ? "png" :
                      blob.type === "image/webp" ? "webp" :
                      blob.type === "image/bmp" ? "bmp" :
                      blob.type === "image/gif" ? "gif" : "img";

    let fileName = "internet-gorseli";

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
    $("urlError").textContent =
      "Görsel alınamadı. Adres geçersiz olabilir veya site dışarıdan erişime izin vermiyor.";
  }
});
$("widthInput").addEventListener("input", () => {
  clearOutput();

  if (!$("keepRatio").checked || !originalWidth || !$("widthInput").value) return;
  const width = Number($("widthInput").value);
  if (width > 0) {
    $("heightInput").value = Math.round(width * originalHeight / originalWidth);
  }
});

$("heightInput").addEventListener("input", () => {
  clearOutput();

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

$("formatSelect").addEventListener("change", clearOutput);
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

  clearOutput();

  const targetBytes = targetKB * 1024;
  const selectedQuality = Number($("qualityInput").value) / 100;
  let quality = selectedQuality;
  let blob = null;
  let resized = false;
  let qualityChanged = false;

  $("convertButton").disabled = true;
  $("status").textContent = t.converting;

  function makeBlob(canvas, q) {
  if (format === "image/gif") {
    return new Promise(resolve => {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: "gif.worker.js"
      });

      gif.addFrame(canvas, {
        
        delay: 100
      });

      gif.on("finished", blob => {
        resolve(blob);
      });

      gif.render();
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
    (format === "image/jpeg" || format === "image/webp" ) &&
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
  $("status").textContent = t.failed;
} finally {
    $("convertButton").disabled = !sourceImage;
  }
});

setLanguage(language);
