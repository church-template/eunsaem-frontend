import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { DEPARTMENTS, DEPT_PAGE } from "@/constants/departments";

vi.mock("next/navigation", () => ({
  usePathname: () => "/departments/student",
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));
// 히어로는 스크롤 연출 분리 — 페이지 합성만 검증. 스크롤 동작은 DeptHero 단위 테스트가 커버.
vi.mock("@/hero/DeptHero", () => ({
  default: ({ title, caption }: { title: string; caption: ReactNode }) => (
    <div data-testid="hero"><h1>{title}</h1><div>{caption}</div></div>
  ),
}));

// 수정 버튼(권한 게이트)은 DeptEditAction 단위 테스트가 커버 — 여기선 노출 위치·id 전달만 본다.
vi.mock("@/components/departments/DeptEditAction", () => ({
  DeptEditAction: ({ backendId }: { backendId: number }) => <span data-testid="dept-edit">{backendId}</span>,
}));

import DepartmentDetailPage, { generateStaticParams } from "./page";

function stubBrowserApis() {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} })));
  vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
}
afterEach(() => vi.unstubAllGlobals());

const student = DEPARTMENTS.find((d) => d.slug === "student")!;

describe("DepartmentDetailPage (상세)", () => {
  it("제목·본문을 합성한다(상수 구동)", async () => {
    stubBrowserApis();
    const { container } = render(
      await DepartmentDetailPage({ params: Promise.resolve({ slug: "student" }) }),
    );
    expect(screen.getByRole("heading", { name: student.name })).toBeDefined(); // 히어로 h1
    // 소개글이 intro.lead와 겹쳐 description(마크다운) 블록은 렌더하지 않는다
    expect(container.querySelector(".prose-church")).toBeNull();
    // 실제 교회는 담당자·하위부서가 없어 해당 영역(인도 줄·하위부서 섹션)은 노출되지 않는다
    expect(screen.queryByText(/인도 ·/)).toBeNull();
    expect(screen.queryByRole("heading", { name: DEPT_PAGE.subHeading })).toBeNull();

    // 보강 섹션(학생부 상수 구동)이 노출된다
    expect(screen.getByRole("heading", { name: "알림 사항" })).toBeDefined();
    expect(screen.getByText("학생부 담당 선생님")).toBeDefined();
    expect(screen.getByRole("heading", { name: "이렇게 함께해요" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "주요 활동" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "특별 프로그램" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "여름 수련회" })).toBeDefined();
    // 활동 사진은 정적 파일이 없어 관리 화면에서 앨범을 연결하기 전엔 구간째 숨는다
    expect(screen.queryByRole("heading", { name: "활동 사진" })).toBeNull();
    expect(screen.getByRole("heading", { name: "학생부에서 함께해요" })).toBeDefined();
    // 모임 안내(알림 사항)가 소개보다 먼저 — 처음 오는 분이 가장 찾는 정보
    const h2s = [...container.querySelectorAll("h2")].map((h) => h.textContent);
    expect(h2s.indexOf("알림 사항")).toBeLessThan(h2s.indexOf("학생부 소개"));
    // 초대 밴드가 마무리라 공용 CtaBand("처음 오셨나요?")는 이 페이지에서 빠진다
    expect(screen.queryByRole("heading", { name: "처음 오셨나요?" })).toBeNull();
  });

  it("없는 slug면 notFound()", async () => {
    stubBrowserApis();
    await expect(
      DepartmentDetailPage({ params: Promise.resolve({ slug: "nope" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateStaticParams가 모든 부서 slug를 반환한다", () => {
    const params = generateStaticParams();
    expect(params).toContainEqual({ slug: "student" });
    expect(params).toContainEqual({ slug: "youth" });
    expect(params).toContainEqual({ slug: "women" });
  });

  it("부서 API 조회가 실패하면 상수 소개 그대로 보인다", async () => {
    stubBrowserApis();
    const spy = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    vi.stubGlobal("fetch", spy);
    render(await DepartmentDetailPage({ params: Promise.resolve({ slug: "student" }) }));
    expect(spy).toHaveBeenCalled();
    expect(screen.getByText(student.intro!.lead)).toBeDefined();
  });

  it("백엔드 id가 연결되면 소개 본문·활동 사진을 API 값으로 바꾸고 수정 버튼 자리를 둔다", async () => {
    stubBrowserApis();
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        id: 7, name: "학생부", leader: "", parentId: null, sortOrder: 0, description: "관리 화면 **소개**",
        createdAt: "", updatedAt: "", version: 1, heroMediaId: 11, albumId: 3, photos: [21],
      }),
    }) as Response));
    student.backendId = 7; // 런타임에서만 연결(상수 파일은 비워 둔다)
    try {
      const { container } = render(
        await DepartmentDetailPage({ params: Promise.resolve({ slug: "student" }) }),
      );
      expect(container.querySelector(".prose-church")?.textContent).toContain("관리 화면 소개");
      expect(screen.queryByText(student.intro!.lead)).toBeNull();
      expect(container.querySelector('img[src="/api/media/21"]')).not.toBeNull();
      expect(screen.getByTestId("dept-edit").textContent).toBe("7");
    } finally {
      delete student.backendId;
    }
  });
});
