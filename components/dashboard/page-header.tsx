import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, meta, className }: Props) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <Badge variant="default" className="mb-3">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 className="font-display text-[28px] font-black leading-[32px] tracking-tight text-charcoal sm:text-[32px] md:text-[35px] md:leading-[39px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-[14px] leading-[22px] text-stone text-pretty sm:text-[15px]">
              {description}
            </p>
          ) : null}
          {meta}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
