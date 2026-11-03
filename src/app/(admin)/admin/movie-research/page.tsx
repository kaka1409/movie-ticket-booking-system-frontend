import type { Metadata } from "next";
import { Suspense } from "react";
import AdminPageHeader from "@/app/(admin)/admin/components/shared/AdminPageHeader";
import { AdminTableSkeleton } from "@/app/(admin)/admin/components/shared/AdminSkeletons";
import { getMovieResearchCandidates, getMovieResearchRuns } from "@/features/admin/api";
import { isUnauthorizedResult } from "@/libs/session";
import AdminDataError from "@/app/(admin)/admin/components/shared/AdminDataError";
import MovieResearchManager from "./components/MovieResearchManager";

export const metadata: Metadata = { title: "AI movie research" };

async function ResearchSection() {
  const [candidateResult, runResult] = await Promise.all([
    getMovieResearchCandidates(),
    getMovieResearchRuns(),
  ]);
  if (isUnauthorizedResult(candidateResult) || isUnauthorizedResult(runResult)) return null;
  if ("error" in candidateResult) return <AdminDataError message={candidateResult.error.message} />;
  if ("error" in runResult) return <AdminDataError message={runResult.error.message} />;
  return <MovieResearchManager candidates={candidateResult.data} runs={runResult.data} />;
}

export default function MovieResearchPage() {
  return (
    <>
      <AdminPageHeader
        eyebrowKey="admin.nav.cinema"
        titleKey="admin.research.title"
        descriptionKey="admin.research.description"
      />
      <Suspense fallback={<AdminTableSkeleton />}>
        <ResearchSection />
      </Suspense>
    </>
  );
}
