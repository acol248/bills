import { useCallback, forwardRef, useRef } from "react";
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";

// helpers
import generateString from "./helpers/generateString";

// styles
import maps from "./Toggle.module.scss";
const mc = mapClassesCurried(maps, true);

function Toggle({ className, variant, children, disabled, ...props }, ref) {
  const idRef = useRef(generateString(8));

  const classList = useClassList(
    { defaultClass: "toggle", className, variant, maps, string: true },
    useCallback(
      _c => {
        disabled && _c.push("toggle--disabled");
      },
      [disabled]
    )
  );

  return (
    <div className={classList}>
      <label className={mc("toggle__label")}>{children}</label>

      <div className={mc("toggle__switch")}>
        <input
          className={mc("toggle__switch-checkbox")}
          type="checkbox"
          id={idRef.current}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        <label className={mc("toggle__switch-highlight")} htmlFor={idRef.current}></label>
      </div>
    </div>
  );
}

export default forwardRef(Toggle);
