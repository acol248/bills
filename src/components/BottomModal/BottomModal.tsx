import { Root, Overlay, Content, Close, Title } from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./BottomModal.module.scss";
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
import type { ReactNode } from "react";

interface BottomModalProps {
  className?: Element["className"];
  variant?: string;
  title: string;
  children?: ReactNode;
  open: boolean;
  onClose: () => void;
  onTransitionEnd?: () => void;
}

export default function BottomModal({
  className,
  variant,
  title,
  children,
  open,
  onClose,
  onTransitionEnd,
}: BottomModalProps) {
  const classList = useClassList({
    defaultClass: "bottom-modal",
    className,
    variant,
    maps,
    string: true,
  }) as string;

  return (
    <Root open={open} onOpenChange={s => !s && onClose()}>
      <Overlay className={mc("modal-overlay")} />

      <Content className={classList} aria-describedby={undefined} onAnimationEndCapture={() => onTransitionEnd?.()}>
        <Title className={mc("bottom-modal__title")}>{title}</Title>

        <Close asChild>
          <button className={mc("bottom-modal__close")} aria-label="close">
            <Cross2Icon />
          </button>
        </Close>

        {children}
      </Content>
    </Root>
  );
}
