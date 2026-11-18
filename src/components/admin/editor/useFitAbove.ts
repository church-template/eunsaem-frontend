"use client";

import { useEffect, type RefObject } from "react";

// 미리보기 칸(sticky)의 높이를 "자기 윗변 ~ 저장 막대 윗변"으로 맞춘다.
// CSS(100dvh 계산)만으로는 페이지 맨 위에서 칸이 아직 붙기 전에 아래쪽이 저장 막대 뒤로 숨는다(#191 시안 확인).
const GAP_PX = 16; // spacing.base — 저장 막대와 띄울 여백
const MIN_PX = 240; // 아주 낮은 창에서도 칸이 접히지 않게

export function useFitAbove(target: RefObject<HTMLElement | null>, bar: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = target.current;
        const b = bar.current;
        if (!el || !b) return;
        const h = b.getBoundingClientRect().top - el.getBoundingClientRect().top - GAP_PX;
        el.style.maxHeight = `${Math.max(MIN_PX, h)}px`;
      });
    };
    fit();
    window.addEventListener("scroll", fit, { capture: true, passive: true });
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", fit, { capture: true });
      window.removeEventListener("resize", fit);
    };
  }, [target, bar]);
}
