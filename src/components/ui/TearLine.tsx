/**
 * Perforation line for a ticket card: a dashed rule with two notches punched into
 * the card's side edges.
 *
 * The notch paints `--color-notch` — the colour *behind* the card, which
 * `.surface-raised` re-points to the panel it lifts a card onto (see global.css).
 * That is what makes the punch read as a hole instead of a blob.
 */
export default function TearLine({
  className = "",
  lineClassName = "",
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-notch)" />
      <div className={`flex-1 border-t-2 border-dashed border-(--color-border) ${lineClassName}`} />
      <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-notch)" />
    </div>
  );
}
