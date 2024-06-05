import { HTMLProps, ReactNode } from "react";

export interface IButton extends HTMLProps<HTMLButtonElement> {
  variant?: string;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
}
