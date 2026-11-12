import { BookOpen, Church, HeartHandshake, Send, Sprout, Users } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { VISION } from "@/constants/content";

// VISION.points 순서(예배·성경·교제·지역사회·다음세대·선교)에 대응하는 아이콘(표현용 매핑).
const ICONS = [Church, BookOpen, Users, HeartHandshake, Sprout, Send] as const;

// 밴드4 — 회색. 좌 제목·대표 문장 : 우 번호 줄 목록 = 4:8(<64rem 세로 쌓기).
// 한 줄짜리 항목 여섯 개라 카드 대신 헤어라인 목록으로 — PastorDossier 철학 목록과 같은 결.
export function VisionGoals() {
  return (
    <section className="break-keep bg-surface-soft py-section">
      <Container>
        <div className="grid gap-xxl lg:grid-cols-[4fr_8fr]">
          <Reveal className="lg:sticky lg:top-nav lg:self-start">
            <h2 className={cn(typo.titleMd, "text-primary")}>{VISION.title}</h2>
            <p className={cn(typo.displayLg, "mt-base text-ink")}>{VISION.statement}</p>
          </Reveal>

          <ol className="border-t-2 border-ink">
            {VISION.points.map((point, i) => {
              const Icon = ICONS[i] ?? Church;
              return (
                <li key={point} className="border-b border-hairline">
                  <Reveal delay={i * 80} className="flex items-center gap-lg py-lg">
                    <span aria-hidden className={cn(typo.datetime, "text-muted")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn(typo.titleMd, "flex-1 text-ink")}>{point}</span>
                    <Icon size={28} aria-hidden className="shrink-0 text-primary" />
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
