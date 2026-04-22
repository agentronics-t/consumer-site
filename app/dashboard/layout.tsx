import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6">{children}</div>
      </main>
      <Footer />
    </>
  );
}
