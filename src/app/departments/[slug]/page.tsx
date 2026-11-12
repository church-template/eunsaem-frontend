import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { Container } from "@/components/shell/Container";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { typo } from "@/constants/typography";
import { cn } from "@/lib/utils";
import DeptHero from "@/hero/DeptHero";
import { DeptLeader } from "@/components/departments/DeptLeader";
import { SubDepartments } from "@/components/departments/SubDepartments";
import { DeptFeatures } from "@/components/departments/DeptFeatures";
import { DeptInfo } from "@/components/departments/DeptInfo";
import { DeptActivities } from "@/components/departments/DeptActivities";
import { DeptPrograms } from "@/components/departments/DeptPrograms";
import { DeptGallery } from "@/components/departments/DeptGallery";
import { DeptInvite } from "@/components/departments/DeptInvite";
import {
  allDepartmentSlugs,
  findDepartment,
  DEPT_SECTIONS,
} from "@/constants/departments";

// 빌드 시 모든 부서 slug(하위 포함)를 정적 생성 — 상수 단일 출처라 백엔드 불필요.
export function generateStaticParams() {
  return allDepartmentSlugs().map((slug) => ({ slug }));
}

// 부서별 검색 메타 — 상수(DEPARTMENTS) 구동이라 fetch 없음. 없는 slug는 페이지가 notFound 처리.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = findDepartment(slug);
  if (!dept) return {};
  return {
    title: dept.name,
    description: dept.caption.join(" "),
    alternates: { canonical: `/departments/${slug}` },
  };
}

// 사역 부서 상세(공개) — 상수 구동. SiteShell 대신 투명+solid 고정 헤더 직접 합성.
// DeptHero 시작이 라이트라 on-dark 투명은 가독성 위험 → 라이트 스킨 고정(메인 무수정).
// 보강 섹션은 데이터가 있는 부서에만 조건부 노출(학생부만 채움, 타 부서는 기존과 동일).
export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = findDepartment(slug);
  if (!dept) {
    notFound();
  }

  // 줄 단위 카피 → block span(메인 caption과 동일 패턴, "\n" 이슈 차단).
  const caption = dept.caption.map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));

  return (
    <>
      <SiteHeader variant="transparent" solid />
      <main className="flex-1">
        <DeptHero title={dept.name} caption={caption} media={dept.media} />
        {/* 안내서 흐름: 모임 안내(언제·어디) → 소개 → 사진 → 함께하는 일 → 초대.
            description(마크다운)은 intro.lead와 내용이 겹쳐 상세에선 렌더하지 않는다. */}
        {dept.info?.length ? <DeptInfo heading={DEPT_SECTIONS.info} items={dept.info} /> : null}
        {dept.leader ? (
          <Container className="pt-xl">
            <DeptLeader name={dept.leader} />
          </Container>
        ) : null}
        {dept.intro && dept.features?.length ? (
          <DeptFeatures
            heading={dept.intro.heading}
            lead={dept.intro.lead}
            items={dept.features}
          />
        ) : null}
        {dept.gallery?.length ? (
          <DeptGallery heading={DEPT_SECTIONS.gallery} photos={dept.gallery} />
        ) : null}
        {dept.activities?.length || dept.programs?.length ? (
          <Container as="section" className="break-keep py-section">
            <h2 className={cn(typo.displayMd, "text-ink")}>{DEPT_SECTIONS.together}</h2>
            <div className="mt-xxl grid gap-xxl lg:grid-cols-2">
              {dept.activities?.length ? (
                <DeptActivities heading={DEPT_SECTIONS.activities} items={dept.activities} />
              ) : null}
              {dept.programs?.length ? (
                <DeptPrograms heading={DEPT_SECTIONS.programs} items={dept.programs} />
              ) : null}
            </div>
          </Container>
        ) : null}
        {dept.children?.length ? <SubDepartments items={dept.children} /> : null}
        {/* 초대 밴드가 마무리 CTA라 공용 CtaBand는 두지 않는다(마무리 두 번 방지). */}
        {dept.invite ? (
          <DeptInvite
            heading={dept.invite.heading}
            body={dept.invite.body}
            phone={dept.info?.find((it) => it.icon === "phone")?.value}
          />
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
