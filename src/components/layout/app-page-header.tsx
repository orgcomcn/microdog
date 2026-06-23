type AppPageHeaderProps = {
  title: string;
  description: string;
  badge?: string;
};

export function AppPageHeader({ title, description, badge }: AppPageHeaderProps) {
  return (
    <section className="mt-5 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,44,0.92)_0%,rgba(5,10,25,0.9)_100%)] px-5 py-8 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10">
      <div className="space-y-4">
        {badge ? (
          <div className="inline-flex rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-cyan-100 uppercase">
            {badge}
          </div>
        ) : null}

        <div className="space-y-3">
          <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/66 sm:text-lg">{description}</p>
        </div>
      </div>
    </section>
  );
}
