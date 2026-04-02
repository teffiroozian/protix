export default function MenuCardActions({
  itemName,
  quantity,
  isAddFeedbackVisible,
  onAddToCart,
  onIncrement,
  onDecrement,
  showDetailsButton,
  onDetails,
}: {
  itemName: string;
  quantity?: number;
  isAddFeedbackVisible: boolean;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  showDetailsButton?: boolean;
  onDetails?: () => void;
}) {
  return (
    <div className="ml-auto inline-flex flex-row items-end gap-2">
      {showDetailsButton ? (
        <button type="button" className="cursor-pointer rounded-xl border border-black/20 bg-white px-4 py-2 text-[15px] font-bold text-black/85" onClick={(event) => { event.stopPropagation(); onDetails?.(); }}>
          Details
        </button>
      ) : null}
      {typeof quantity === "number" && quantity > 0 ? (
        <div className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white/90 px-2 py-1">
          <button type="button" className="h-7 w-7 cursor-pointer rounded-lg border border-black/15 bg-white text-lg leading-none" onClick={(event) => { event.stopPropagation(); onDecrement(); }} aria-label={`Decrease quantity of ${itemName}`}>-</button>
          <span className="min-w-6 text-center text-base font-bold">{quantity}</span>
          <button type="button" className="h-7 w-7 cursor-pointer rounded-lg border border-black/15 bg-white text-lg leading-none" onClick={(event) => { event.stopPropagation(); onIncrement(); }} aria-label={`Increase quantity of ${itemName}`}>+</button>
        </div>
      ) : (
        <button
          type="button"
          className={`cursor-pointer rounded-xl border px-[18px] py-2 text-base font-bold text-white transition ${isAddFeedbackVisible ? "border-green-700 bg-green-600 -translate-y-px" : "border-black/20 bg-black/90"} disabled:cursor-not-allowed`}
          disabled={isAddFeedbackVisible}
          onClick={(event) => { event.stopPropagation(); onAddToCart(); }}
        >
          {isAddFeedbackVisible ? "Added ✓" : "Add to Cart"}
        </button>
      )}
    </div>
  );
}
