type PlaceholderCardProps = {
  title: string;
  description: string;
  items: string[];
};

export function PlaceholderCard({
  title,
  description,
  items,
}: PlaceholderCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold text-slate-950">{title}</h2>
      <p className="mb-5 text-sm leading-6 text-slate-600">{description}</p>
      <ul className="space-y-3 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
