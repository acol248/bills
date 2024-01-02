import { useMemo } from "react";

export default function Icon({ type, ...props }) {
  const icon = useMemo(() => {
    switch (type) {
      case "text":
        return (
          <svg {...props} viewBox="0 -960 960 960">
            <path d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z" />
          </svg>
        );
      default:
        return null;
    }
  }, [props, type]);

  return icon;
}
