export const PageHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold">{title}</h1>
    {subtitle && <p className="text-gray-400">{subtitle}</p>}
  </div>
);

