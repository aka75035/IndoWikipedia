import Link from "next/link";
import { NAV_ITEMS } from "@/constants/navigation";

type NavLinksProps = {
  onLinkClick?: () => void;
};

export default function NavLinks({ onLinkClick }: NavLinksProps) {  return (
    <div className="flex flex-col  lg:flex-row lg:items-center gap-6">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className="font-medium text-gray-700 transition hover:text-blue-600"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}