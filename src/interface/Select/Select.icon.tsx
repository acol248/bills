import { useMemo } from "react";

import type { SVGProps } from "react";

interface IIcon extends SVGProps<SVGSVGElement> {
  type: "expand";
}

export default function Icon({ type, ...props }: IIcon) {
  const icon = useMemo(() => {
    switch (type) {
      case "expand":
        return (
          <svg {...props} viewBox="0 0 48 48">
            <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
          </svg>
        );
      default:
        return;
    }
  }, [props, type]);

  return icon;
}
