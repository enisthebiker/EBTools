const CDN_BASE = "https://cdn.jsdelivr.net/npm/@jsquash/avif@2.1.1/";

let decoderPromise;
let encoderPromise;
let encoderDefaultsPromise;

async function getDecoder() {
  if (!decoderPromise) {
    decoderPromise = import(CDN_BASE + "codec/dec/avif_dec.js").then(async ({ default: createDecoder }) =>
      createDecoder({
        locateFile: () => CDN_BASE + "codec/dec/avif_dec.wasm"
      })
    );
  }
  return decoderPromise;
}

async function getEncoder() {
  if (!encoderPromise) {
    encoderPromise = import(CDN_BASE + "codec/enc/avif_enc.js").then(async ({ default: createEncoder }) =>
      createEncoder({
        locateFile: () => CDN_BASE + "codec/enc/avif_enc.wasm"
      })
    );
  }
  return encoderPromise;
}

async function getEncoderDefaults() {
  if (!encoderDefaultsPromise) {
    encoderDefaultsPromise = import(CDN_BASE + "meta.js").then(module => module.defaultOptions);
  }
  return encoderDefaultsPromise;
}

self.onmessage = async event => {
  const { type } = event.data;

  try {
    if (type === "decode") {
      const decoder = await getDecoder();
      const image = decoder.decode(event.data.buffer, 8);
      if (!image) throw new Error("AVIF decoding failed");

      const pixels = new Uint8Array(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength
      ).slice();
      self.postMessage({
        ok: true,
        width: image.width,
        height: image.height,
        pixels: pixels.buffer
      }, [pixels.buffer]);
      return;
    }

    if (type === "encode") {
      const [encoder, defaultOptions] = await Promise.all([
        getEncoder(),
        getEncoderDefaults()
      ]);
      const output = encoder.encode(
        new Uint8Array(event.data.pixels),
        event.data.width,
        event.data.height,
        {
          ...defaultOptions,
          quality: Math.round(event.data.quality * 100)
        }
      );
      if (!output) throw new Error("AVIF encoding failed");

      const buffer = output.slice().buffer;
      self.postMessage({ ok: true, buffer }, [buffer]);
      return;
    }

    throw new Error("Unknown AVIF worker task");
  } catch (error) {
    self.postMessage({
      ok: false,
      code: type === "decode" ? "AVIF_DECODE_ERROR" : "AVIF_ENCODE_ERROR",
      message: error.message
    });
  }
};
