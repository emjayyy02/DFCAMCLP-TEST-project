export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-3xl border-b border-border pb-6">
      <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-[70ch] leading-7 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
