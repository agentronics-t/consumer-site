"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07091A",
          color: "#F5F5F4",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#94A3B8" }}>
            FATAL ERROR
          </p>
          <h1 style={{ fontSize: 28, margin: "16px 0", fontWeight: 700 }}>
            Something broke at the root
          </h1>
          <p style={{ color: "#CBD5E1", marginBottom: 24 }}>
            Please refresh the page. If the issue persists, contact support.
            {error.digest ? <span style={{ display: "block", marginTop: 8, fontSize: 11, color: "#64748B" }}>Ref: {error.digest}</span> : null}
          </p>
          <button
            onClick={reset}
            style={{
              background: "#F59E0B",
              color: "#07091A",
              border: 0,
              padding: "10px 20px",
              borderRadius: 9999,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
