import {
  BookOpen,
  Compass,
  Hammer,
  Handshake,
  HandHeart,
  MessagesSquare,
  Mic,
  Music,
  Sparkles,
  Speaker,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptFeature } from "@/constants/departments";

// 아이콘은 직렬화 키를 컴포넌트에서 매핑. 부서마다 항목 뜻에 맞는 아이콘을 고르도록 키를 넓혔다.
const ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  users: Users,
  sparkles: Sparkles,
  messages: MessagesSquare,
  compass: Compass,
  mic: Mic,
  music: Music,
  speaker: Speaker,
  handshake: Handshake,
  hammer: Hammer,
  "hand-heart": HandHeart,
};

// 부서 소개(dept-features) — 좌 제목·리드 : 우 번호 줄 목록 = 4:8(vision-goals 결).
// 한 줄 항목이라 카드 대신 줄로 — 카드 틀이 내용보다 무거워지지 않게.
export function DeptFeatures({
  heading,
  lead,
  items,
}: {
  heading: string;
  lead?: string;
  items: DeptFeature[];
}) {
  return (
    <Container as="section" className="grid gap-xxl break-keep py-section lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <h2 className={cn(typo.displayMd, "text-ink")}>{heading}</h2>
        {lead ? <p className={cn(typo.bodyLg, "mt-base text-body")}>{lead}</p> : null}
      </Reveal>
      <ol className="border-t-2 border-ink lg:col-span-8">
        {items.map((f, i) => {
          const Icon = ICONS[f.icon] ?? BookOpen;
          return (
            <li key={f.title} className="border-b border-hairline">
              <Reveal delay={i * 120} className="flex gap-base py-xl">
                <span className={cn(typo.datetime, "w-10 shrink-0 pt-xxs text-muted")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className={cn(typo.titleLg, "text-ink")}>{f.title}</h3>
                  <p className={cn(typo.bodyMd, "mt-xxs text-body")}>{f.desc}</p>
                </div>
                <Icon size={28} aria-hidden className="shrink-0 text-primary" />
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
