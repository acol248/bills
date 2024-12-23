import { Root, Image, Fallback } from "@radix-ui/react-avatar";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Avatar.module.scss";
const mc = mapClassesCurried(maps, true);

// types
interface Props {
  className?: string;
  src?: string;
  fallback: string;
}

export default function Avatar({ className, src, fallback }: Props) {
  const classList = useClassList({ defaultClass: "avatar", className, maps, string: true });

  return (
    <Root className={classList}>
      <Image className={mc("avatar__image")} src={src} />

      <Fallback className={mc("avatar__fallback")}>{fallback}</Fallback>
    </Root>
  );
}
