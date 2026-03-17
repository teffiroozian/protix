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
    <span className="inline-flex w-fit items-center gap-2">
      <label className="inline-flex w-fit items-center">
        <span className="sr-only">{ariaLabel}</span>
        <select
          className="w-fit cursor-pointer appearance-none rounded-full bg-[#121212] py-[2px] pr-6 pl-4 text-base font-bold text-white [field-sizing:content] [background-image:linear-gradient(45deg,transparent_50%,#ffffff_50%),linear-gradient(135deg,#ffffff_50%,transparent_50%),linear-gradient(to_right,transparent,transparent)] [background-position:calc(100%-15px)_55%,calc(100%-10px)_55%,100%_0] [background-size:5px_5px,5px_5px,2.5em_2.5em] bg-no-repeat focus:outline focus:outline-1 focus:outline-black/20 focus:outline-offset-2"
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
