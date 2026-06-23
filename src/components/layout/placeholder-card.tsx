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
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.88)_0%,rgba(5,10,25,0.84)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="mb-5 text-sm leading-7 text-white/62">{description}</p>
      <ul className="space-y-3 text-sm text-white/78">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-white/8 bg-white/[0.05] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
