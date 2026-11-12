import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/shell/Container";
import { Reveal } from "@/components/main/Reveal";
import { buttonVariants } from "@/components/ui/Button";
import { typo } from "@/constants/typography";
import { CTA_BAND } from "@/constants/content";
import { DEPT_PAGE } from "@/constants/departments";
import { cn } from "@/lib/utils";

// 닫는 초대(dept-invite) — 다크 밴드로 페이지를 마무리. 공용 CtaBand와 겹치지 않게 이 페이지에선 이것만 둔다.
// 버튼 둘 다 56px(cta-band-dark와 같은 대형 CTA). 전화번호가 없는 부서는 오시는 길만.
export function DeptInvite({
  heading,
  body,
  phone,
}: {
  heading: string;
  body: string;
  phone?: string;
}) {
  return (
    <section className="bg-surface-dark py-section">
      <Container className="break-keep">
        <Reveal>
          <h2 className={cn(typo.displayLg, "text-on-dark")}>{heading}</h2>
          <p className={cn(typo.bodyLg, "mt-base max-w-3xl text-on-dark-soft")}>{body}</p>
          <div className="mt-xxl flex flex-col gap-sm sm:flex-row">
            {phone ? (
              <a href={`tel:${phone}`} className={cn(buttonVariants("pillCta"), "gap-xs")}>
                <Phone size={20} aria-hidden />
                {DEPT_PAGE.inviteCall}
              </a>
            ) : null}
            <Link
              href="/about/location"
              className={cn(buttonVariants("outlineOnDark"), "h-14 gap-xs px-8")}
            >
              {CTA_BAND.secondary}
              <ArrowRight size={20} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
