interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
    </header>
  );
}
