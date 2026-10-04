"use client";

import { useState } from "react";

type DonorAvatarProps = {
  initials: string;
  profileImage?: string | null;
  width: number;
  height: number;
  className: string;
};

export function DonorAvatar({
  initials,
  profileImage,
  className,
}: DonorAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const imageUrl = profileImage?.trim() || null;

  return (
    <div className={className}>
      {imageUrl && failedImageUrl !== imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full rounded-full object-cover"
          onError={() => setFailedImageUrl(imageUrl)}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
