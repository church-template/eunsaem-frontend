import { Clock, MapPin, Phone, User, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import type { DeptInfoItem } from "@/constants/departments";

// 아이콘은 직렬화 키를 컴포넌트에서 매핑(DeptFeatures와 동일 방식).
const ICONS: Record<string, LucideIcon> = {
  clock: Clock,
  pin: MapPin,
  user: User,
  phone: Phone,
};

// 모임 안내 한 줄(dept-glance) — 히어로 바로 아래. 처음 오는 분이 가장 찾는 "언제·어디·누구"를 맨 앞에 둔다.
// 헤딩은 시각적으로 숨기고(줄 자체가 안내라 제목이 과함) 문서 구조용으로만 남긴다.
export function DeptInfo({ heading, items }: { heading: string; items: DeptInfoItem[] }) {
  return (
    <Container as="section" className="break-keep">
      <h2 className="sr-only">{heading}</h2>
      <dl className="grid border-b border-hairline md:grid-cols-4">
        {items.map((it) => {
          const Icon = ICONS[it.icon] ?? Clock;
          return (
            <div
              key={it.label}
              className="flex gap-sm border-t border-hairline py-lg md:border-t-0 md:border-l md:px-lg md:py-xl md:first:border-l-0 md:first:pl-0"
            >
              <Icon size={24} aria-hidden className="mt-xxs shrink-0 text-muted" />
              <div>
                <dt className={cn(typo.datetime, "text-muted")}>{it.label}</dt>
                <dd className={cn(typo.titleMd, "mt-xxs text-ink")}>
                  {it.icon === "phone" ? (
                    <a href={`tel:${it.value}`} className="text-primary hover:underline">
                      {it.value}
                    </a>
                  ) : (
                    it.value
                  )}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </Container>
  );
}
