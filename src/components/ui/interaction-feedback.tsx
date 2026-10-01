"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Decoration only: navigation and live-region text never wait for animation. */
export function InteractionFeedback() {
  const pathname = usePathname();
  const destination = useRef<string | null>(null);
  useEffect(() => {
    function intent(event: MouseEvent) {
      if (
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        link &&
        link.origin === location.origin &&
        link.pathname !== location.pathname &&
        !link.target
      )
        destination.current = link.pathname;
    }
    function restore() {
      destination.current = null;
    }
    document.addEventListener("click", intent, true);
    window.addEventListener("popstate", restore);
    return () => {
      document.removeEventListener("click", intent, true);
      window.removeEventListener("popstate", restore);
    };
  }, []);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const header = document.querySelector<HTMLElement>(
      ".portal-main .page-header, .portal-main .context-header",
    );
    if (destination.current === pathname && !media.matches)
      header?.setAttribute("data-arrival", "true");
    destination.current = null;
    const animations = new Set<Animation>();
    function settle() {
      header?.removeAttribute("data-arrival");
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    const observer = new MutationObserver((records) => {
      if (media.matches) return;
      const regions = new Set<HTMLElement>();
      for (const record of records) {
        const element =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement;
        const status = element?.closest<HTMLElement>('[role="status"]');
        if (
          status?.textContent?.trim() &&
          status.getClientRects().length &&
          !status.classList.contains("sr-only")
        )
          regions.add(status);
      }
      regions.forEach((region) => {
        region.getAnimations().forEach((animation) => animation.cancel());
        const animation = region.animate(
          [
            { backgroundColor: "transparent" },
            { backgroundColor: "#eef0ff", offset: 0.36 },
            { backgroundColor: "transparent" },
          ],
          { duration: 500, easing: "cubic-bezier(.2,0,0,1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    });
    const main = document.querySelector(".portal-main");
    if (main)
      observer.observe(main, {
        subtree: true,
        childList: true,
        characterData: true,
      });
    media.addEventListener("change", settle);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", settle);
      settle();
    };
  }, [pathname]);
  return null;
}
