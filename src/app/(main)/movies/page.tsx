"use client";

import MobileMovieGrid from "./components/mobile/MovieGrid";
import DesktopMovieGrid from "./components/desktop/MovieGrid";

export default function MoviesPage() {
  return (
    <>
      <div className="block md:hidden">
        <MobileMovieGrid />
      </div>
      <div className="hidden md:block">
        <DesktopMovieGrid />
      </div>
    </>
  );
}
