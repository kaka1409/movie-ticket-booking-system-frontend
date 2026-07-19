import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";

export default function CredentialsLoading() {
  return (
    <div className="block md:hidden">
      <BookingSkeleton step={4} />
    </div>
  );
}
