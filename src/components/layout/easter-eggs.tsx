"use client";

import { ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LOGO_SECRET_EVENT = "portfolio:logo-secret";

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function dispatchLogoSecret() {
  window.dispatchEvent(new Event(LOGO_SECRET_EVENT));
}

export function EasterEggs() {
  const [blueprint, setBlueprint] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const sequence = useRef({ count: 0, lastPress: 0 });
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function showNotice(message: string) {
      setNotice(message);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setNotice(null), 4600);
    }

    function toggleBlueprint() {
      setBlueprint((active) => {
        const next = !active;
        showNotice(next ? "Blueprint mode enabled. Press B B B or Escape to close." : "Blueprint mode disabled.");
        return next;
      });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setBlueprint((active) => {
          if (active) showNotice("Blueprint mode disabled.");
          return false;
        });
        sequence.current = { count: 0, lastPress: 0 };
        return;
      }

      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditableTarget(event.target) ||
        event.key.toLowerCase() !== "b"
      ) {
        if (!isEditableTarget(event.target)) sequence.current = { count: 0, lastPress: 0 };
        return;
      }

      const now = Date.now();
      const count = now - sequence.current.lastPress < 850 ? sequence.current.count + 1 : 1;
      sequence.current = { count, lastPress: now };
      if (count === 3) {
        sequence.current = { count: 0, lastPress: 0 };
        toggleBlueprint();
      }
    }

    function onLogoSecret() {
      showNotice("Built carefully. Deployed continuously. Improved relentlessly.");
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(LOGO_SECRET_EVENT, onLogoSecret);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(LOGO_SECRET_EVENT, onLogoSecret);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("blueprint-mode", blueprint);
    return () => document.documentElement.classList.remove("blueprint-mode");
  }, [blueprint]);

  return (
    <>
      {blueprint ? (
        <div aria-hidden="true" className="blueprint-overlay">
          <div className="blueprint-label">
            <ScanLine size={14} /> Blueprint / 8px system
          </div>
        </div>
      ) : null}
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-4 bottom-5 z-[100] flex justify-center">
        {notice ? (
          <p className="rounded-full border border-accent/25 bg-[#0b0d10]/95 px-4 py-2.5 text-center font-mono text-[0.68rem] uppercase tracking-[0.1em] text-zinc-300 shadow-2xl backdrop-blur-xl">
            {notice}
          </p>
        ) : null}
      </div>
    </>
  );
}
