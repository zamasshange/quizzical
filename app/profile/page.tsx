import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Footer from "@/components/Footer";
import ProfileClient from "@/components/ProfileClient";

export const metadata: Metadata = {
  title: "My Games",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <SiteShell showCategories={false}>
      <ProfileClient />
      <Footer />
    </SiteShell>
  );
}
