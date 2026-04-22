import Image from "next/image";

export function LogoMark({ size = 32 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo.jpeg"
      alt="Agentronics"
      width={size}
      height={size}
      priority
      className="rounded-lg"
    />
  );
}

export function Logotype({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={32} />
      <span className="font-display text-[17px] font-bold tracking-tight text-ink">
        Agentronics
      </span>
    </div>
  );
}
