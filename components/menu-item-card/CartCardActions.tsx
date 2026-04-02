export default function CartCardActions({
  itemName,
  quantity,
  onModify,
  onIncrement,
  onDecrement,
}: {
  itemName: string;
  quantity: number;
  onModify: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button type="button" className="cursor-pointer rounded-xl border border-black/20 bg-white px-3 py-2 text-sm font-bold" onClick={(event) => { event.stopPropagation(); onModify(); }}>
        Modify
      </button>
      <div className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white/90 px-2 py-1">
        <button type="button" className="h-7 w-7 cursor-pointer rounded-lg border border-black/15 bg-white text-lg leading-none" onClick={(event) => { event.stopPropagation(); onDecrement(); }} aria-label={`Decrease quantity of ${itemName}`}>-</button>
        <span className="min-w-6 text-center text-base font-bold">{quantity}</span>
        <button type="button" className="h-7 w-7 cursor-pointer rounded-lg border border-black/15 bg-white text-lg leading-none" onClick={(event) => { event.stopPropagation(); onIncrement(); }} aria-label={`Increase quantity of ${itemName}`}>+</button>
      </div>
    </div>
  );
}
