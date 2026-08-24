import SectionHeader from "@/components/ui/SectionHeader";

export default function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <SectionHeader variant="goldBar" action={action}>
      {children}
    </SectionHeader>
  );
}
