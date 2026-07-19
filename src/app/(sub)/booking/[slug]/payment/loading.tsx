import BookingSkeleton from "@/app/(sub)/booking/components/mobile/BookingSkeleton";

export default function PaymentLoading() {
  return (
    <div className="block md:hidden">
      <BookingSkeleton step={5} />
    </div>
  );
}
