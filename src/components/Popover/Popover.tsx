import { Portal, Trigger, Root, Content, Close } from "@radix-ui/react-popover";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Popover.module.scss";
const mc = mapClassesCurried(maps, true);

// types
interface Props {
  className?: string;
  trigger: React.ReactNode;
  children: React.ReactNode | React.ReactNode[];
  offset?: { side?: number; align?: number };
}

export default function Popover({ className, trigger, children, offset }: Props) {
  const classList = useClassList({ defaultClass: "popover", className, maps, string: true });

  return (
    <Root>
      <Trigger>{trigger}</Trigger>
      <Portal>
        <Content className={classList} align="start" alignOffset={offset?.align} sideOffset={offset?.side}>
          {children}

          <Close className={mc('popover__close')}>
            <svg viewBox="0 -960 960 960">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </Close>
        </Content>
      </Portal>
    </Root>
  );
}
