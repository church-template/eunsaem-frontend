import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeptInvite } from "./DeptInvite";

afterEach(() => vi.unstubAllGlobals());

describe("DeptInvite", () => {
  it("초대 헤딩과 본문을 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(
      <DeptInvite
        heading="학생부에서 함께해요"
        body="언제든 편안하게 참여하세요."
        phone="041-337-2298"
      />
    );
    expect(
      screen.getByRole("heading", { name: "학생부에서 함께해요" })
    ).toBeDefined();
    expect(
      screen.getByText("언제든 편안하게 참여하세요.")
    ).toBeDefined();
    expect(screen.getByRole("link", { name: /전화로 문의하기/ }).getAttribute("href")).toBe("tel:041-337-2298");
    expect(screen.getByRole("link", { name: "오시는 길" }).getAttribute("href")).toBe("/about/location");
  });

  it("전화번호가 없으면 전화 버튼을 숨긴다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<DeptInvite heading="함께해요" body="본문" />);
    expect(screen.queryByRole("link", { name: /전화로 문의하기/ })).toBeNull();
    expect(screen.getByRole("link", { name: "오시는 길" })).toBeDefined();
  });
});
