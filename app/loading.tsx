export default function Loading() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="flex items-center gap-3 text-text-muted">
        <span
          className="h-2 w-2 rounded-full bg-accent animate-pulse"
          aria-hidden
        />
        <span
          className="h-2 w-2 rounded-full bg-accent animate-pulse [animation-delay:120ms]"
          aria-hidden
        />
        <span
          className="h-2 w-2 rounded-full bg-accent animate-pulse [animation-delay:240ms]"
          aria-hidden
        />
        <span className="sr-only">Loading…</span>
      </div>
    </main>
  );
}
