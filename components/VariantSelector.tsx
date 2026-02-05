import styles from "./VariantSelector.module.css";
import type { ItemVariant } from "@/types/menu";

type VariantSelectorProps = {
  variants: ItemVariant[];
  selectedId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
};

export default function VariantSelector({
  variants,
  selectedId,
  onChange,
  ariaLabel = "Select portion",
}: VariantSelectorProps) {
  return (
    <span className={styles.wrapper}>
      <label className={styles.label}>
        <span className={styles.srOnly}>{ariaLabel}</span>
        <select
          className={styles.select}
          value={selectedId}
          onChange={(event) => onChange(event.target.value)}
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>
    </span>
  );
}
