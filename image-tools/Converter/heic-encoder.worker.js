const WASM_BUNDLE_URL = "https://cdn.jsdelivr.net/npm/elheif@0.1.0/pkg/elheif-wasm.js";

let elheifPromise;

function getElheif() {
  if (!elheifPromise) {
    elheifPromise = (async () => {
      // Load only when this encoder worker receives its first request.
      await import(WASM_BUNDLE_URL);

      const initialize = globalThis.__init__ELHEIF_MODULE;
      if (typeof initialize !== "function") {
        throw new Error("elheif WASM bundle did not expose its initializer");
      }

      const module = {};
      await new Promise((resolve, reject) => {
        module.onRuntimeInitialized = resolve;
        module.onAbort = reason => reject(new Error(`elheif WASM initialization failed: ${reason}`));
        initialize(module);
      });

      return module;
    })();
  }

  return elheifPromise;
}

function copyEncoderOutput(data) {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data.slice(0));
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice();
  }

  throw new Error(`Unexpected elheif output type: ${Object.prototype.toString.call(data)}`);
}

function validateHeifOutput(bytes) {
  if (bytes.byteLength < 16) {
    throw new Error(`HEIC encoder output is too short: ${bytes.byteLength} bytes`);
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const boxSize = view.getUint32(0, false);
  const boxType = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  const majorBrand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  const validBrands = new Set(["heic", "heix", "hevc", "hevx", "mif1", "msf1"]);

  if (boxType !== "ftyp" || boxSize < 16 || boxSize > bytes.byteLength || !validBrands.has(majorBrand)) {
    throw new Error(`Invalid HEIF file type box (size=${boxSize}, bytes=${bytes.byteLength}, brand=${majorBrand})`);
  }
}

self.onmessage = async ({ data }) => {
  if (data?.type !== "encode") return;

  try {
    const { pixels, width, height } = data;
    if (!(pixels instanceof ArrayBuffer) ||
        !Number.isInteger(width) || !Number.isInteger(height) ||
        width < 1 || height < 1 || pixels.byteLength !== width * height * 4) {
      throw new Error("Invalid RGBA pixel buffer or dimensions for HEIC encoding");
    }

    const elheif = await getElheif();
    const result = elheif.jsEncodeImage(new Uint8Array(pixels), width, height);
    if (result.err) throw new Error(result.err);

    // elheif returns a view into WASM memory; copy before another WASM call.
    const bytes = copyEncoderOutput(result.data);
    validateHeifOutput(bytes);

    self.postMessage({ ok: true, buffer: bytes.buffer }, [bytes.buffer]);
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "HEIC encoding failed"
    });
  }
};
