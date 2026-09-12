import type { PlatformLink } from "@/lib/release";
import { PlatformSaveRow } from "./PlatformSaveRow";

type PlatformSaveListProps = {
  platforms: PlatformLink[];
  isReleased: boolean;
};

export function PlatformSaveList({ platforms, isReleased }: PlatformSaveListProps) {
  return (
    <ul className="flex flex-col gap-2" aria-label="Pre-save links, one per platform">
      {platforms.map((link) => (
        <PlatformSaveRow key={link.platform} link={link} isReleased={isReleased} />
      ))}
    </ul>
  );
}
