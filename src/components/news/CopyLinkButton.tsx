"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  url: string;
};

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
      >
        Copy link
      </button>
      <span role="status" className="ml-2 text-small text-muted">
        {state === "copied" && "Link copied."}
        {state === "failed" && "Could not copy the link."}
      </span>
    </>
  );
}
