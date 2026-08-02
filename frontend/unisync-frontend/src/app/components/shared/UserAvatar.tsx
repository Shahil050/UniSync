"use client";

import { User as UserIcon } from "lucide-react";

const SIZE_CLASSES = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
} as const;

type Size = keyof typeof SIZE_CLASSES;

export function initialsFor(name: string) {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserAvatar({
  name,
  src,
  size = "md",
  onClick,
  className = "",
}: {
  name: string;
  src?: string | null;
  size?: Size;
  onClick?: () => void;
  className?: string;
}) {
  const sizeClasses = SIZE_CLASSES[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        onClick={onClick}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0 border border-slate-200 ${
          onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        } ${className}`}
      />
    );
  }

  const initials = initialsFor(name);

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses} rounded-full bg-slate-800 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm ${
        onClick ? "cursor-pointer hover:bg-blue-600 transition-colors" : ""
      } ${className}`}
    >
      {initials || <UserIcon size={14} />}
    </div>
  );
}