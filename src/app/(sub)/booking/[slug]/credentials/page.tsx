"use client";

import PageContent from "./components/mobile/PageContent";
import DesktopCredentialsContent from "./components/desktop/CredentialsContent";

export default function CredentialsPage() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden">
        <PageContent />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopCredentialsContent />
      </div>
    </>
  );
}
