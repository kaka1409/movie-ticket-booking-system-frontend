import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";

export default function CinemaLoading() {
  return (
    <div className="block md:hidden">
      <BookingSkeleton step={1} />
    </div>
  );
}
