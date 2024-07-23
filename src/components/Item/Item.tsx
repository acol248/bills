// styles
import useClassList, { mapClassesCurried } from "@blocdigital/useclasslist";
import maps from './Item.module.scss';
const mc = mapClassesCurried(maps, true) as (c: string) => string;

// types
interface ItemProps {
  className?: Element['className'],
  label: string;
  value: string;
}

export default function Item({ className, label, value }: ItemProps) {
  const classList = useClassList({ defaultClass: 'item', className, maps, string: true }) as string;

  return (
    <div className={classList}>
      <p className={mc('item__label')}>{label}</p>

      <p className={mc('item__value')}>{value}</p>
    </div>
  )
}