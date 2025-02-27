import { Select as RadixSelect } from "radix-ui";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Select.module.scss";

// types
import type { Props } from "./Select.d";

const mc = mapClassesCurried(maps, true);

export default function Select({ className, items, label, placeholder, ...props }: Props) {
  const classList = useClassList({ defaultClass: "select", className, maps, string: true }) as string;

  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.Trigger className={mc("select-trigger")}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <svg viewBox="0 -960 960 960">
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content className={classList}>
          <RadixSelect.Viewport>
            {items.map(({ value, label }) => (
              <RadixSelect.Item className={mc("select__item")} value={value} key={value}>
                <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
