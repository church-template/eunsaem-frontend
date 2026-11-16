import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ABOUT } from "@/constants/content";
import { SymbolismList } from "./SymbolismList";

afterEach(() => vi.unstubAllGlobals());

describe("SymbolismList", () => {
  it("헤딩·리드와 4색 색이름·제목·설명을 모두 렌더한다", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));
    render(<SymbolismList />);
    expect(screen.getByText(ABOUT.symbolismHeading)).toBeDefined();
    expect(screen.getByText(ABOUT.symbolismLead)).toBeDefined();
    // 색 이름은 별도 span이라 getByText로 한 줄을 못 찾는다 — h3 전체 글자로 비교한다
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    ABOUT.symbolism.forEach((symbol) => {
      expect(titles).toContain(`${symbol.color} · ${symbol.title}`);
      expect(screen.getByText(symbol.lines[0])).toBeDefined();
    });
  });
});
