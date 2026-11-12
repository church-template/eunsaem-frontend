import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptProgram } from "@/constants/departments";

// 특별 프로그램 — "이렇게 함께해요" 섹션의 오른쪽 칸. 주요 활동과 같은 줄 목록 결(이름 + 설명).
export function DeptPrograms({ heading, items }: { heading: string; items: DeptProgram[] }) {
  return (
    <Reveal>
      <h3 className={cn(typo.titleMd, "pb-base text-ink")}>{heading}</h3>
      <ul className="border-t-2 border-ink">
        {items.map((p) => (
          <li key={p.name} className="border-b border-hairline py-md">
            <h4 className={cn(typo.titleMd, "text-ink")}>{p.name}</h4>
            <p className={cn(typo.bodySm, "mt-xxs text-body")}>{p.desc}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
