import { useMemo } from "react";

export default function Icon({ type, ...props }) {
  const icon = useMemo(() => {
    switch (type) {
      case "add":
        return (
          <svg {...props} viewBox="0 -960 960 960">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        );
      default:
        return (
          <svg {...props} viewBox="0 0 24 24">
            <path d="M11 15h2v2h-2v-2zm0-8h2v6h-2V7zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        );
    }
  }, [props, type]);

  return icon;
}
