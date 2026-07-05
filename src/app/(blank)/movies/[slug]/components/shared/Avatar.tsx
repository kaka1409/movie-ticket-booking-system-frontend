import Image from "next/image";

export default function Avatar({
  src,
  name,
  size = "w-11 h-11",
}: {
  src?: string;
  name: string;
  size?: string;
}) {
  return (
    <div
      className={`${size} rounded-full overflow-hidden shrink-0 border border-(--color-border)`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={44}
          height={44}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-(--color-border) flex items-center justify-center">
          <span className="text-(--color-gold) text-xs font-bold">
            {name.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
