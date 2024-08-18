import { Root, Track, Range, Thumb, SliderProps as Props } from "@radix-ui/react-slider";

// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from "./Slider.module.scss";
const mc = mapClassesCurried(maps, true);

// types
interface SliderProps extends Props {
  className?: Element["className"];
}

export default function Slider({ className, ...props }: SliderProps) {
  const classList = useClassList({ defaultClass: "slider", className, maps, string: true });

  return (
    <Root className={classList} {...props}>
      <Track className={mc("slider__track")}>
        <Range className={mc("slider__range")} />
      </Track>
      <Thumb className={mc("slider__thumb")} />
    </Root>
  );
}
