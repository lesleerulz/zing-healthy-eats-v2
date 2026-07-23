"use client";

interface CustomerAvatarProps {
  src: string | null | undefined;
  username: string;
}

export default function CustomerAvatar({ src, username }: CustomerAvatarProps) {
  const imgSrc = src
    ? src.startsWith("http")
      ? src
      : `/images/${src}`
    : "/images/default_profile.webp";

  return (
    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={username}
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/default_profile.webp";
        }}
      />
    </div>
  );
}
