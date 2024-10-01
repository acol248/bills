import { Root, Overlay, Content, Close, Title, Portal } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Modal.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
import type { ReactNode } from "react";

interface ModalProps {
  className?: Element["className"];
  variant?: string;
  title: string;
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ className, variant, title, children, open, onClose }: ModalProps) {
  const classList = useClassList({ defaultClass: "modal", className, variant, maps, string: true }) as string;

  return (
    <Root open={open} onOpenChange={s => !s && onClose()}>
      <Overlay className={mc("modal-overlay")} />

      <Portal>
        <Content className={classList} aria-describedby={undefined}>
          <Title className={mc("modal__title")}>{title}</Title>

          <Close asChild>
            <button className={mc("modal__close")} aria-label="close">
              <Cross2Icon />
            </button>
          </Close>

          {children}
        </Content>
      </Portal>
    </Root>
  );
}
