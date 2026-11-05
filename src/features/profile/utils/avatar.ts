/** Client-side downscale: every avatar leaves the browser as one 512² WebP. */
export const AVATAR_SIZE = 512;
export const AVATAR_MAX_INPUT_BYTES = 10 * 1024 * 1024;

export async function toAvatarBlob(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported");
  }
  if (file.size > AVATAR_MAX_INPUT_BYTES) {
    throw new Error("Image is too large (max 10 MB)");
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas is not available");
  }

  // Cover-fit crop so the result is always square regardless of source ratio.
  const scale = Math.max(
    AVATAR_SIZE / bitmap.width,
    AVATAR_SIZE / bitmap.height,
  );
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  const offsetX = (AVATAR_SIZE - width) / 2;
  const offsetY = (AVATAR_SIZE - height) / 2;
  context.drawImage(bitmap, offsetX, offsetY, width, height);
  bitmap.close();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      "image/webp",
      0.85,
    );
  });
}
