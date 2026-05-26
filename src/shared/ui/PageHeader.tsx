import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, actions }: PageHeaderProps) {
  return (
    <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <span className="mb-2 block font-label-caps text-secondary tracking-[0.2em]">{eyebrow}</span>
        <h2 className="font-headline-lg text-[32px] leading-tight text-primary md:text-headline-lg">{title}</h2>
      </div>
      {actions ? <div className="flex flex-wrap gap-4">{actions}</div> : null}
    </section>
  );
}
