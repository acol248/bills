import { SelectProps } from 'radix-ui'

type Item = {
  value: string;
  label: string;
};

interface Props extends SelectProps {
  className?: string;
  label: string;
  items: Array<Item>;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export type { Props, Item };
