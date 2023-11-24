import { Buffer } from "buffer";

export function encodeBase64(payload: any) {
  if (!payload) return;

  try {
    const json = JSON.stringify(payload);

    return Buffer.from(json, "binary").toString("base64");
  } catch (err) {
    console.error(err);
  }
}

export function decodeBase64(payload: any) {
  if (!payload) return;

  try {
    const string = Buffer.from(payload, "base64").toString("binary");
    const decoded = new TextDecoder().decode(
      new Uint8Array(Buffer.from(string, "binary"))
    );

    return JSON.parse(decoded);
  } catch (err) {
    console.error(err);
  }
}
