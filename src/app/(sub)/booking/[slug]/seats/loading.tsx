import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";

export default function SeatsLoading() {
  return (
    <div className="block md:hidden">
      <BookingSkeleton step={2} />
    </div>
  );
}
