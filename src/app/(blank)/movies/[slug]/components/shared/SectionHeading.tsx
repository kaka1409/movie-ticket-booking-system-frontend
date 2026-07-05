export default function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-(--color-text-primary) font-bold text-base flex items-center gap-2">
        <span className="inline-block w-1 h-5 rounded-full bg-(--color-gold)" />
        {children}
      </h2>
      {action}
    </div>
  );
}
