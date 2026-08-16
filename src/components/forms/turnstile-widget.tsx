"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({ onToken, resetNonce = 0 }: { onToken: (token: string) => void; resetNonce?: number }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      onToken("unconfigured");
      return;
    }

    let widgetId: string | undefined;
    let cancelled = false;
    let attempts = 0;

    const mount = () => {
      if (cancelled || !container.current) return;
      if (window.turnstile) {
        widgetId = window.turnstile.render(container.current, {
          sitekey: siteKey,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => {
            onToken(token);
            setReady(true);
          },
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
        return;
      }
      attempts += 1;
      if (attempts < 50) window.setTimeout(mount, 120);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-portfolio-turnstile="true"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.portfolioTurnstile = "true";
      script.addEventListener("load", mount, { once: true });
      document.head.appendChild(script);
    } else {
      mount();
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken, resetNonce, siteKey]);

  if (!siteKey) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs leading-5 text-zinc-500">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-zinc-400" size={15} />
        Secure delivery activates when the deployment credentials are configured.
      </div>
    );
  }

  return (
    <div aria-label={ready ? "Verification complete" : "Verification challenge"}>
      <div ref={container} />
    </div>
  );
}
