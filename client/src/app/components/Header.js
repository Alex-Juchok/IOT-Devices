// components/Header.js
"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Header = () => {
  const pathname = usePathname(); // /events/current
  const searchParams = useSearchParams();
  const room = searchParams.get("room");

  const breadcrumbs = useMemo(() => {
    const parts = pathname
      .split("/")
      .filter(Boolean) // удаляем пустые
      .map((part) => decodeURIComponent(part));

    const crumbs = ["IoT Dashboard", ...parts];

    if (pathname.startsWith("/events/current") && room) {
      room
      ?.split(".")
      .filter(Boolean)
      .map((location) => crumbs.push(location));
    }
    return crumbs;
  }, [pathname, room]);

  return (
    <header className="bg-gray-300 text-black dark:bg-gray-800 dark:text-white p-4 fixed w-full top-0 z-10 shadow-md">
      <h1 className="text-xl font-semibold">
        {breadcrumbs.join(" > ")}
      </h1>
    </header>
  );
};

export default Header;

  