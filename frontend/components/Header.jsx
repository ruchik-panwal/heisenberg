import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between bg-[#333333] rounded-full h-17 px-3 py-2 pl-5 w-full">
        <div className="text-white text-3xl font-bold font-vend tracking-tight">
          HeisenBerg
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-6 font-vend text-lg">
          <Link href="#" className="text-gray-400 cursor-default">
            HeisenBerg
          </Link>
          <Link href="#" className="text-white cursor-default">
            HeisenBerg
          </Link>
          <Link href="#" className="text-gray-400 cursor-default">
            HeisenBerg
          </Link>
        </nav>

        {/* Right Side: Circular Avatar/Button Placeholder */}
        <div className="w-10 h-10 bg-white rounded-full flex-shrink-0"></div>
      </div>
    </header>
  );
}