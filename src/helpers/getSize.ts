import encodeUtf8 from "encode-utf8";

export const getSize = (string: string, size: "bytes" | "kb" | "mb" | "gb" = "kb") => {
  switch (size) {
    case "bytes":
      return String(encodeUtf8(string)).length;
    case "kb":
      return String(encodeUtf8(string)).length / 1024;
    case "mb":
      return String(encodeUtf8(string)).length / 1024 / 1024;
    case "gb":
      return String(encodeUtf8(string)).length / 1024 / 1024 / 1024;
  }
};
