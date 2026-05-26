import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, actions }: PageHeaderProps) {
  return (
    <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <span className="mb-1 block text-xs font-bold uppercase text-secondary">{eyebrow}</span>
        <h2 className="text-[24px] font-bold leading-tight text-primary md:text-headline-lg">{title}</h2>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}
