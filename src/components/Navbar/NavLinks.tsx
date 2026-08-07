import Link from "next/link";
import { NAV_ITEMS } from "@/constants/navigation";

export default function NavLinks() {
  return (
    <div className="flex gap-6">
      {NAV_ITEMS.map(({href,label}) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </div>
  );
}