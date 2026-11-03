const PACKAGE_URL = "https://cdn.jsdelivr.net/npm/@keeratita/heic-converter@0.5.2/dist/index.mjs";

self.onmessage = async event => {
  if (event.data?.type !== "decode") return;

  try {
    // Load the pinned decoder only after a HEIC/HEIF file is selected.
    const { convertHeic } = await import(PACKAGE_URL);
    const blob = await convertHeic(event.data.file, { to: "png" });
    self.postMessage({ ok: true, blob });
  } catch (error) {
    self.postMessage({
      ok: false,
      message: error instanceof Error ? error.message : "HEIC/HEIF decode failed"
    });
  }
};
