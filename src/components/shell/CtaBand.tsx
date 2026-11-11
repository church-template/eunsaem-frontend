import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Container } from "./Container";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { CTA_BAND, WORSHIP_SERVICES } from "@/constants/content";

// 대표 예배(주일예배)에서 안내 한 줄을 만든다 — 시간·장소의 단일 출처는 WORSHIP_SERVICES.
const primaryService = WORSHIP_SERVICES.find((s) => s.primary);

// 프리푸터 밴드(DESIGN cta-band-dark). 단체 사진 위 다크 덮개 + 헤드라인 display-lg + 안내 한 줄 + CTA 2개.
export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-dark py-section">
      <Image src={CTA_BAND.image} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      {/* 사진이 밝아도 흰 글자가 읽히도록 덮개를 깐다 */}
      <div className="absolute inset-0 -z-10 bg-surface-dark/70" aria-hidden />
      <Container className="flex flex-col items-center gap-lg text-center">
        <div className="flex flex-col gap-sm">
          <h2 className={cn(typo.displayLg, "text-on-dark")}>{CTA_BAND.heading}</h2>
          {primaryService ? (
            <p className={cn(typo.bodyMd, "break-keep text-on-dark")}>
              {primaryService.place}에서 {primaryService.time}에 함께 예배드려요.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-sm sm:flex-row">
          <Link href="/about" className={buttonVariants("pillCta")}>
            {CTA_BAND.primary}
          </Link>
          {/* outline 보조 CTA도 pill-cta와 동일 크기(56px) — DESIGN.md가 CTA 밴드 버튼 둘 다 대형 필로 명시 */}
          <Link
            href="/about/location"
            className={cn(buttonVariants("outlineOnDark"), "h-14 px-8")}
          >
            {CTA_BAND.secondary}
          </Link>
        </div>
      </Container>
    </section>
  );
}
