import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="text-sm uppercase tracking-widest text-text-muted">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          Page not found
        </h1>
        <p className="text-text-secondary">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Go home
          </ButtonLink>
          <ButtonLink href="/docs" variant="outline">
            Read the docs
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
