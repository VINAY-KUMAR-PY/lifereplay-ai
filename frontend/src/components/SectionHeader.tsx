interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>}
      <h1 className="text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h1>
      {description && <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>}
    </div>
  );
}
