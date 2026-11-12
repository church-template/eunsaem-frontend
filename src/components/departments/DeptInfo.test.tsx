import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeptInfo } from "./DeptInfo";
import type { DeptInfoItem } from "@/constants/departments";

afterEach(() => vi.unstubAllGlobals());

const items: DeptInfoItem[] = [
  { icon: "user", label: "담당자", value: "학생부 담당 선생님" },
  { icon: "phone", label: "연락처", value: "041-337-2298" },
];

describe("DeptInfo", () => {
  it("헤딩과 label/value를 한 줄 안내로 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<DeptInfo heading="알림 사항" items={items} />);
    expect(screen.getByRole("heading", { name: "알림 사항" })).toBeDefined();
    expect(screen.getByText("담당자")).toBeDefined();
    expect(screen.getByText("학생부 담당 선생님")).toBeDefined();
    // 연락처(phone)는 누르면 바로 전화가 걸리도록 tel: 링크
    expect(screen.getByRole("link", { name: "041-337-2298" }).getAttribute("href")).toBe("tel:041-337-2298");
    expect(screen.queryByRole("link", { name: "학생부 담당 선생님" })).toBeNull();
  });
});
