/** Shared Clerk component appearance — neo-brutalist Quizzical styling. */
export const clerkAppearance = {
  variables: {
    colorPrimary: "#5b19df",
    colorText: "#0a0a0a",
    colorTextSecondary: "rgba(10, 10, 10, 0.6)",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#0a0a0a",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-nunito), system-ui, sans-serif",
  },
  elements: {
    rootBox: "mx-auto flex w-full justify-center",
    cardBox: "mx-auto w-full max-w-full shadow-none",
    card: "mx-auto w-full border-0 bg-transparent p-0 shadow-none",
    main: "mx-auto w-full gap-4",
    header: "hidden",
    headerTitle: "font-display text-3xl font-extrabold",
    headerSubtitle: "font-semibold text-ink/60",
    socialButtonsBlockButton:
      "rounded-full border-4 border-ink bg-white py-2.5 font-extrabold transition-transform hover:-translate-y-0.5",
    socialButtonsBlockButtonText: "font-extrabold",
    dividerLine: "bg-ink/15",
    dividerText: "text-xs font-bold text-ink/40",
    formFieldLabel: "font-bold text-ink",
    formFieldInput:
      "rounded-xl border-2 border-ink/20 px-3 py-2.5 font-semibold outline-none focus:border-ink",
    formButtonPrimary:
      "rounded-full border-4 border-ink bg-grass py-2.5 font-extrabold text-white shadow-[0_4px_0_0_#0d0d0d] transition-transform hover:-translate-y-0.5",
    footerActionLink: "font-bold text-grass",
    footerActionText: "text-sm font-bold text-ink/60",
    identityPreviewEditButton: "font-bold text-grass",
  },
};
