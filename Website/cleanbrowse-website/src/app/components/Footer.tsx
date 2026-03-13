import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-8 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/app-icon.png" alt="CleanBrowse" width={28} height={28} className="rounded-lg" />
          <span className="text-sm">
            <span className="font-semibold text-white">CleanBrowse</span>{" "}
            <span className="text-neutral-500">by </span>
            <span className="text-green-400">Hamy Digital</span>
          </span>
        </div>
        <span className="text-neutral-500 text-sm">&copy; {new Date().getFullYear()} CleanBrowse</span>
      </div>
    </footer>
  );
}
