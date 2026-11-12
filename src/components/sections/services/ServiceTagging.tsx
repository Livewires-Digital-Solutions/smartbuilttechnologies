import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Label } from "@/components/ui/Typography";
import { assetTagging } from "@/content/service-pages";

/** Asset tagging, the section of the asset management page that has its own link (#asset-tagging). */
export function ServiceTagging({ index }: { index: string }) {
  const t = assetTagging;
  return (
    <Section surface="white" id="asset-tagging" aria-labelledby="tagging-title">
      <div className="container-x">
        <SectionHead
          id="tagging-title"
          index={index}
          label={t.label}
          aside={
            <p className="max-w-[58ch] text-lead text-slate-700">{t.intro}</p>
          }
        >
          {t.title}
        </SectionHead>

        <div className="grid-12 mt-14 gap-y-12 lg:mt-20">
          <div className="reveal col-span-12 flex flex-col gap-4 lg:col-span-4 lg:col-start-4">
            <Label className="text-slate-700">{t.fitsTitle}</Label>
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-slate-700">
              {t.fits}
            </p>
          </div>
          <ul className="col-span-12 border-t-[1.5px] border-t-navy lg:col-span-4 lg:col-start-9">
            {t.items.map((it, i) => (
              <li
                key={it.title}
                className="reveal border-b border-[var(--hairline)] py-5"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-overline text-slate-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.375rem] leading-tight font-medium tracking-[-0.03em]">
                    {it.title}
                  </h3>
                </div>
                <p className="mt-2 pl-8 text-[0.9375rem] text-slate-700">
                  {it.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <dl className="reveal mt-16 grid grid-cols-3 border-t-[1.5px] border-t-navy lg:mt-24">
          {t.stats.map((f, i) => (
            <div
              key={f.big}
              className={
                "flex flex-col gap-2 py-6 pr-4 lg:py-8" +
                (i > 0 ? " border-l border-[var(--hairline)] pl-4 lg:pl-8" : "")
              }
            >
              <dt className="order-2 mt-2">
                <Label>{f.label}</Label>
              </dt>
              <dd className="order-1 text-[clamp(2.5rem,1.6rem+4.4vw,6rem)] leading-[0.9] font-medium tracking-[-0.06em]">
                {f.big}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
