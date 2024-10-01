import useClassList from "@blocdigital/useclasslist";
import maps from "./Keypad.module.scss";

// types

interface Props {
  className?: Element["className"];
  variant?: string;
  onChange: (value: string | undefined) => void;
  onConfirm: () => void;
}

export default function Keypad({ className, variant, onChange, onConfirm }: Props) {
  const classList = useClassList({ defaultClass: "keypad", className, variant, maps, string: true });

  return (
    <div className={classList}>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        1
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        2
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        3
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        4
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        5
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        6
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        7
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        8
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        9
      </button>
      <button type="button" onClick={() => onChange("backspace")}>
        <svg viewBox="0 -960 960 960">
          <path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z" />
        </svg>
      </button>
      <button type="button" onClick={e => onChange((e?.target as HTMLButtonElement)?.innerHTML)}>
        0
      </button>
      <button type="button" onClick={() => onConfirm()}>
        <svg viewBox="0 -960 960 960">
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
      </button>
    </div>
  );
}
