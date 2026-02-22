import { getImmichAsset } from "@/lib/services/immich-service";
import { useEffect, useState } from "react";

export function useAvatarSrc(imageId?: string | null) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!imageId) return;
    getImmichAsset({ type: "thumbnail", id: imageId }).then(setSrc);
  }, [imageId]);

  return src;
}
