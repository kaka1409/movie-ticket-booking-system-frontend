export default function TearLine({
  className = "",
  lineClassName = "",
}: {
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute -left-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
      <div className={`flex-1 border-t-2 border-dashed border-(--color-border) ${lineClassName}`} />
      <div className="absolute -right-3 w-6 h-6 rounded-full z-10 bg-(--color-bg)" />
    </div>
  );
}
