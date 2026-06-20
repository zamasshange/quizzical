import type { ReactNode } from "react";
import Navbar from "./Navbar";
import CategoryNav from "./CategoryNav";

type Props = {
  children: ReactNode;
  /** Hide the category nav on focused pages like the editor / play screens */
  showCategories?: boolean;
  /** Vertically and horizontally center main content (sign-in, onboarding) */
  centerContent?: boolean;
};

export default function SiteShell({
  children,
  showCategories = true,
  centerContent = false,
}: Props) {
  return (
    <div className="relative z-0 flex min-h-full flex-auto flex-col">
      <Navbar />

      <div className="pointer-events-none absolute inset-0 top-0 z-0 bg-quiz-pattern opacity-[0.06]" />

      <main
        className={`custom-container relative z-10 flex-1 px-4 sm:px-6 md:px-8 lg:px-12 ${
          centerContent
            ? "flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center py-8 md:min-h-[calc(100dvh-5rem)]"
            : "pb-16"
        }`}
      >
        {showCategories && (
          <div className="py-5 md:py-6">
            <CategoryNav />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
