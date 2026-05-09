"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-8 text-center space-y-4">
      <h2 className="text-xl font-semibold text-text-primary">Dashboard failed to load</h2>
      <p className="text-text-secondary text-sm">
        Something went wrong fetching your data.
        {error.digest ? <span className="block mt-1 text-xs text-text-muted">Ref: {error.digest}</span> : null}
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Button onClick={reset} variant="primary" size="sm">
          Retry
        </Button>
        <ButtonLink href="/" variant="outline" size="sm">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
