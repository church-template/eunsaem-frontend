import { describe, it, expect } from "vitest";
import { safeReturnPath } from "./returnPath";

const F = "/mypage/manage/departments";

describe("safeReturnPath", () => {
  it("같은 사이트 경로는 그대로 돌려준다", () => {
    expect(safeReturnPath("/departments/student", F)).toBe("/departments/student");
  });

  it.each([
    ["//evil.example"],
    ["https://evil.example"],
    ["javascript:alert(1)"],
    ["/\\evil.example"],
    ["/\t/evil.example"],
    ["/\n/evil.example"],
    ["/\r/evil.example"],
    ["departments/student"],
    [""],
  ])("외부·비정상 주소 %s는 기본 주소로 바꾼다", (from) => {
    expect(safeReturnPath(from, F)).toBe(F);
  });

  it("없으면 기본 주소", () => {
    expect(safeReturnPath(null, F)).toBe(F);
    expect(safeReturnPath(undefined, F)).toBe(F);
  });
});
