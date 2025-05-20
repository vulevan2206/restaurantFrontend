import Header from "@/components/dev/Header";

interface Props {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="mt-[var(--header-height)]">
      <Header />
      <div>{children}</div>
    </div>
  );
}
