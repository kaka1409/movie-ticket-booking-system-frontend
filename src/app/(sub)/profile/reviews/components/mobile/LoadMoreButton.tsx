export default function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="
          w-full rounded-2xl border border-(--color-border)
          bg-(--color-surface) py-3.5 text-sm font-bold uppercase
          tracking-widest text-(--color-gold-light)
          transition-all duration-150
          hover:border-(--color-gold)/40 hover:text-(--color-gold)
          active:scale-[0.98]
        "
      >
        Load More
      </button>
    </div>
  );
}
