import { useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "@blocdigital/usemediaquery";

// helpers
import { formatCurrency } from "../../helpers/format";
import { sumRemainingItems } from "../../helpers/itemHelpers";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Overview.module.scss";
const mc = mapClassesCurried(maps, true);

// types
import type { Item } from "../../hooks/useData";

interface Props {
  className?: string;
  items: Array<Item>;
}

export default function Overview({ className, items = [] }: Props) {
  const [isMobile] = useMediaQuery("(max-width: 767px) and (max-height: 551px)");

  const ref = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const classList = useClassList(
    { defaultClass: "overview", className, maps, string: true },
    useCallback(
      (c: string[]) => {
        if (open) c.push("overview--open");
      },
      [open]
    )
  );

  // trigger scroll lift anim
  useEffect(() => {
    if (!isMobile) return;

    const { current: container } = ref;

    if (!container) return;

    const updateScroll = () => {
      const { current: overview } = ref;

      if (!overview) return;

      if ((ref.current?.scrollTop ?? 0) > 0) {
        overview.style.setProperty("box-shadow", "1px 1px 8px 1px rgba(0, 0, 0, 0.09)");
      } else {
        overview.style.removeProperty("box-shadow");
      }
    };

    container.addEventListener("scroll", updateScroll);

    return () => container.removeEventListener("scroll", updateScroll);
  }, [isMobile]);

  return (
    <div className={classList} ref={ref}>
      <div className={mc("overview__month-total")}>
        <span>{formatCurrency(sumRemainingItems(items))}</span> left this month
      </div>
      <p className={mc("overview__subtle")}>{formatCurrency(items.reduce((a, c) => (a += c.value), 0))} total</p>

      <button className={mc("overview__mode-toggle")} onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 -960 960 960">
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>
      </button>
    </div>
  );
}
