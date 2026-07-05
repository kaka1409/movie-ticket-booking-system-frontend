import Image from "next/image";
import SectionHeading from "../shared/SectionHeading";
import { useMovie } from "../shared/MovieContext";

export default function TopCast() {
  const movie = useMovie();

  return (
    <section className="px-4">
      <SectionHeading>Top Cast</SectionHeading>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
        {movie.cast.map((actor) => (
          <div
            key={actor.name}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-(--color-surface) border border-(--color-border) overflow-hidden">
              <Image
                src={actor.src}
                alt={actor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-(--color-text-primary) text-xs font-semibold text-center leading-tight">
              {actor.name}
            </p>
            <p className="text-(--color-text-muted) text-[10px] text-center">
              {actor.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
