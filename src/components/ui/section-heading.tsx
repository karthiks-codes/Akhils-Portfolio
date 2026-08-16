type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "split";
};

export function SectionHeading({ label, title, description, align = "split" }: SectionHeadingProps) {
  return (
    <header
      className={
        align === "split"
          ? "grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.75fr)] md:items-end"
          : "max-w-3xl"
      }
    >
      <div>
        <p className="eyebrow">{label}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {description ? <p className="lede m-0">{description}</p> : null}
    </header>
  );
}
