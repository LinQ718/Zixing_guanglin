export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-5 md:mb-7">
      <h1 className="font-serif-tc text-2xl md:text-[30px] tracking-[0.14em] text-[rgba(44,32,16,0.95)]">
        {title}
      </h1>
      <p className="mt-2 text-sm md:text-[15px] leading-relaxed tracking-[0.05em] text-[rgba(76,62,41,0.72)]">
        {description}
      </p>
    </header>
  );
}
