"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
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
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="text-sm uppercase tracking-widest text-text-muted">Error</p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Something went wrong
        </h1>
        <p className="text-text-secondary">
          We hit an unexpected error. The team has been notified.
          {error.digest ? <span className="block mt-2 text-xs text-text-muted">Ref: {error.digest}</span> : null}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <ButtonLink href="/" variant="outline">
            Go home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
