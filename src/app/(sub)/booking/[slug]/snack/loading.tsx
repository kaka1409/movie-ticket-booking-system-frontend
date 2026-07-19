import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";

export default function SnackLoading() {
  return (
    <div className="block md:hidden">
      <BookingSkeleton step={3} />
    </div>
  );
}
