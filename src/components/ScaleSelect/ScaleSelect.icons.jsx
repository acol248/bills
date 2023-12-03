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
        return (
          <svg {...props} viewBox="0 -960 960 960">
            <path d="M560-320v-1040H160v-240h1040v240H800v1040H560Zm720 0v-640h-240v-240h720v240h-240v640h-240Z" />
          </svg>
        );
    }
  }, [props, type]);

  return icon;
}
