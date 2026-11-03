const UTIF_URL = "https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.js";
const PAKO_URL = "https://cdn.jsdelivr.net/npm/pako@1.0.11/dist/pako.min.js";
const LARGE_IMAGE_PIXELS = 40_000_000;

let utifLoaded = false;
let pakoLoaded = false;
let pendingLargeImageConfirmation = null;

function loadUtif() {
  if (!utifLoaded) {
    importScripts(UTIF_URL);
    if (!self.UTIF) throw new Error("UTIF.js did not load");
    utifLoaded = true;
  }
}

function loadPako() {
  if (!pakoLoaded) {
    importScripts(PAKO_URL);
    if (!self.pako) throw new Error("Pako did not load");
    pakoLoaded = true;
  }
}

function tagNumber(value) {
  return Array.isArray(value) ? Number(value[0]) : Number(value);
}

async function decodeTiff(file) {
  const buffer = await file.arrayBuffer();
  loadUtif();

  const ifds = UTIF.decode(buffer);
  const firstPage = ifds[0];
  if (!firstPage) throw new Error("TIFF file contains no image pages");

  const width = tagNumber(firstPage.t256);
  const height = tagNumber(firstPage.t257);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new Error("TIFF image dimensions are invalid");
  }

  if (width * height > LARGE_IMAGE_PIXELS) {
    self.postMessage({ confirmationRequired: true, width, height });
    const accepted = await new Promise(resolve => {
      pendingLargeImageConfirmation = resolve;
    });
    pendingLargeImageConfirmation = null;
    if (!accepted) {
      self.postMessage({ ok: true, cancelled: true });
      return;
    }
  }

  const compression = tagNumber(firstPage.t259);
  if (compression === 8 || compression === 32946) loadPako();

  UTIF.decodeImage(buffer, firstPage, ifds);
  const decoded = UTIF.toRGBA8(firstPage);
  if (decoded.byteLength !== width * height * 4) {
    throw new Error("Decoded TIFF pixel data does not match its dimensions");
  }

  const pixels = new Uint8Array(decoded.byteLength);
  pixels.set(decoded);
  self.postMessage({ ok: true, width, height, pixels: pixels.buffer }, [pixels.buffer]);
}

function encodeTiff(pixels, width, height) {
  if (!(pixels instanceof ArrayBuffer) ||
      !Number.isInteger(width) || !Number.isInteger(height) ||
      width < 1 || height < 1 || pixels.byteLength !== width * height * 4) {
    throw new Error("Invalid RGBA pixel buffer or dimensions for TIFF encoding");
  }

  loadUtif();
  const output = UTIF.encodeImage(pixels, width, height);
  if (!(output instanceof ArrayBuffer) || output.byteLength < 8) {
    throw new Error("UTIF.js returned invalid TIFF data");
  }

  const header = new Uint8Array(output, 0, 4);
  const littleEndian = header[0] === 0x49 && header[1] === 0x49 &&
    header[2] === 0x2a && header[3] === 0x00;
  const bigEndian = header[0] === 0x4d && header[1] === 0x4d &&
    header[2] === 0x00 && header[3] === 0x2a;
  if (!littleEndian && !bigEndian) throw new Error("UTIF.js output has an invalid TIFF signature");

  return output;
}

self.onmessage = async ({ data }) => {
  if (data?.type === "continue") {
    pendingLargeImageConfirmation?.(Boolean(data.accepted));
    return;
  }

  try {
    if (data?.type === "decode") {
      await decodeTiff(data.file);
    } else if (data?.type === "encode") {
      const buffer = encodeTiff(data.pixels, data.width, data.height);
      self.postMessage({ ok: true, buffer }, [buffer]);
    }
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "TIFF operation failed"
    });
  }
};
