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
      case "remove":
        return (
          <svg {...props} viewBox="0 -960 960 960">
            <path d="M200-440v-80h560v80H200Z" />
          </svg>
        );
      default:
        return null;
    }
  }, [props, type]);

  return icon;
}
