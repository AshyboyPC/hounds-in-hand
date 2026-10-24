import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** One lightweight controller shared by every route. */
export default function SmoothScroll() {
  const { pathname, hash, key } = useLocation();
  const navigate = useNavigate();
  const controller = useRef<Lenis | null>(null);
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const configure = () => {
      controller.current?.destroy();
      controller.current = null;
      if (motionPreference.matches) return;

      const lenis = new Lenis({
        autoRaf: true,
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: false,
        anchors: false,
        allowNestedScroll: true,
        autoToggle: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      });
      controller.current = lenis;
    };

    configure();
    motionPreference.addEventListener("change", configure);
    return () => {
      motionPreference.removeEventListener("change", configure);
      controller.current?.destroy();
      controller.current = null;
    };
  }, []);

  useEffect(() => {
    const followAnchor = (event: MouseEvent) => {
      if (!controller.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return;
      try { if (!document.getElementById(decodeURIComponent(destination.hash.slice(1)))) return; }
      catch { return; }
      event.preventDefault();
      navigate({ pathname: destination.pathname, search: destination.search, hash: destination.hash });
    };
    document.addEventListener("click", followAnchor);
    return () => document.removeEventListener("click", followAnchor);
  }, [navigate]);

  useEffect(() => {
    let target: HTMLElement | null = null;
    if (hash) {
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { /* A malformed fragment should still leave the page usable. */ }
    }
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (controller.current) {
      controller.current.resize();
      controller.current.scrollTo(target ?? 0, {
        immediate: changedPage || !target,
        onComplete: () => {
          if (!target) return;
          const temporaryFocus = !target.hasAttribute("tabindex");
          if (temporaryFocus) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (temporaryFocus) target.addEventListener("blur", () => target?.removeAttribute("tabindex"), { once: true });
        },
        force: true,
      });
    } else {
      window.scrollTo(0, target ? target.getBoundingClientRect().top + window.scrollY - 24 : 0);
    }
  }, [pathname, hash, key]);

  return null;
}
