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
}

export type { Props, Item };
