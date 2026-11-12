import Image from "next/image";
import { Overline } from "@/components/ui/Typography";
import { clients } from "@/content/credentials";

/** "RSG" is held back until TXG confirms it is a separate client (see credentials.ts). */
const shown = clients.filter((c) => c.name !== "RSG");

/** "Trusted by Industry Leaders": the client logos, in the group's own words. */
export function ProjectsClients() {
  return (
    <div className="container-x">
      <div className="grid-12 items-start gap-y-10">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:pr-6">
          <Overline index="02" className="text-slate-700">
            Clients
          </Overline>
          <h2 id="projects-clients-title" className="text-h1">
            Trusted by Industry Leaders
          </h2>
          <p className="max-w-[40ch] text-lead text-slate-700">
            We collaborate with some of the most dynamic organizations and
            visionary clients across the globe.
          </p>
        </div>
        <ul className="col-span-12 grid grid-cols-2 border-t-[1.5px] border-t-navy sm:grid-cols-3 lg:col-span-8 lg:grid-cols-4">
          {shown.map((c, i) => (
            <li
              key={c.name}
              className="reveal group relative flex h-28 items-center justify-center border-b border-l border-[var(--hairline)] px-5 max-sm:odd:border-l-0 sm:max-lg:nth-[3n+1]:border-l-0 lg:nth-[4n+1]:border-l-0 lg:h-32"
              style={
                { "--reveal-delay": `${(i % 4) * 70}ms` } as React.CSSProperties
              }
            >
              <Image
                src={c.src}
                alt={c.name}
                width={328}
                height={160}
                sizes="(min-width: 1024px) 14vw, 40vw"
                className="h-14 w-full object-contain opacity-90 grayscale contrast-125 transition-[opacity,filter,translate] duration-[var(--duration-ui)] ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100 lg:h-[4.25rem]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2.5 left-0 w-full px-3 text-center font-mono text-[0.625rem] leading-tight tracking-[0.06em] text-slate-700 uppercase opacity-0 transition-opacity duration-[var(--duration-ui)] group-hover:opacity-100"
              >
                {c.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
