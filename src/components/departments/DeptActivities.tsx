import { Check } from "lucide-react";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";

// 주요 활동 — "이렇게 함께해요" 섹션의 왼쪽 칸. 2px ink 룰 아래 헤어라인 줄 목록, 체크는 항목 마커.
export function DeptActivities({ heading, items }: { heading: string; items: string[] }) {
  return (
    <Reveal>
      <h3 className={cn(typo.titleMd, "pb-base text-ink")}>{heading}</h3>
      <ul className="border-t-2 border-ink">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-sm border-b border-hairline py-md">
            <Check size={20} aria-hidden className="shrink-0 text-primary" />
            <span className={cn(typo.bodyMd, "text-ink")}>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
