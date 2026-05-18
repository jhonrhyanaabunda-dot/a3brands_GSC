import Link from "next/link";

import { InfoHero } from "@/components/marketing/info-hero";

interface Section {
  title: string;
  body: string[];
}

interface Props {
  title: string;
  eyebrow: string;
  description?: string;
  lastUpdated: string;
  sections: Section[];
}

export function LegalPage({ title, eyebrow, description, lastUpdated, sections }: Props) {
  return (
    <>
      <InfoHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        meta={
          <p className="font-display text-[12px] font-medium uppercase tracking-[0.15em] text-stone">
            Last updated · {lastUpdated}
          </p>
        }
      />

      <section className="container py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12">
          {/* TOC */}
          <aside className="lg:col-span-3">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-stone">
              On this page
            </p>
            <ul className="mt-3 space-y-2 text-[13px]">
              {sections.map((s) => (
                <li key={s.title}>
                  <Link
                    href={`#${slug(s.title)}`}
                    className="text-stone transition-colors hover:text-brand"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Body */}
          <article className="lg:col-span-9 space-y-10">
            {sections.map((s) => (
              <section key={s.title} id={slug(s.title)}>
                <h2 className="font-display text-[20px] font-bold tracking-tight text-charcoal sm:text-[24px]">
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-[14px] leading-[22px] text-charcoal">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-pretty">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="text-[14px] leading-[22px] text-stone">
                Questions about this document? Email{" "}
                <a href="mailto:hello@lonestarford.com" className="font-semibold text-brand hover:underline">
                  hello@lonestarford.com
                </a>{" "}
                or contact us through{" "}
                <Link href="/contact" className="font-semibold text-brand hover:underline">
                  /contact
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
