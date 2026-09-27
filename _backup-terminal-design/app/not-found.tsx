import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <div className="relative min-h-screen">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />
      <Nav />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-48 text-center">
        <p className="font-mono text-sm text-acc">
          <span className="text-dim">$</span> cat ./this-page
        </p>
        <h1 className="mt-4 font-mono text-6xl font-extrabold text-ink">404</h1>
        <p className="mt-3 font-mono text-sm text-mut">
          cat: ./this-page: No such file or directory
        </p>
        <Link
          href="/"
          className="mt-8 rounded bg-acc px-6 py-2.5 font-mono text-sm font-semibold text-[#04130c] transition-opacity hover:opacity-85"
        >
          cd ~/
        </Link>
      </main>
    </div>
  );
}
