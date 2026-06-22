"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (lang: string) => {
    router.push(`/${lang}${pathname.replace(/^\/(en|np)/, "")}`);
  };

  return (
    <div className="flex gap-2 fixed top-5 right-5 bg-white shadow px-3 py-2 rounded-full">
      <button onClick={() => changeLang("en")} className="hover:text-blue-600">
        EN
      </button>
      <span>|</span>
      <button onClick={() => changeLang("np")} className="hover:text-blue-600">
        NP
      </button>
    </div>
  );
}