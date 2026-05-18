import { Badge } from "@/components/ui/badge";

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  align?: "left" | "center";
}

export function InfoHero({ eyebrow, title, description, meta, align = "center" }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-stone-200 bg-stone-50 pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(29,185,84,0.16) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div className="container relative">
        <div
          className={
            "mx-auto max-w-3xl " + (align === "center" ? "text-center" : "")
          }
        >
          {eyebrow ? <Badge variant="default">{eyebrow}</Badge> : null}
          <h1 className="mt-4 text-balance font-display font-black tracking-tight text-charcoal text-[36px] leading-[40px] sm:text-[48px] sm:leading-[52px] md:text-[56px] md:leading-[60px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-pretty text-[14px] leading-[22px] text-stone sm:text-[15px] sm:leading-[24px]">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-6">{meta}</div> : null}
        </div>
      </div>
    </section>
  );
}
