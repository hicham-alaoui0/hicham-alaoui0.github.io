import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Nav />
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-6 py-32 text-center md:px-10 md:py-40">
        <p className="t-mono text-slate">Error 404</p>
        <h1 className="t-hero mt-6 text-ink">Page not found.</h1>
        <p className="t-lead mt-5 max-w-lg text-slate">
          The page you were looking for has moved, or never existed.
        </p>
        <Link href="/" className="btn-primary mt-9">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
