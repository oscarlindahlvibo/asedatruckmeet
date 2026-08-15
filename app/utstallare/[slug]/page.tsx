import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { exhibitors } from "@/lib/demo-data";

export function generateStaticParams() {
  return exhibitors.map((item) => ({ slug: item.slug }));
}

export default async function ExhibitorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exhibitor = exhibitors.find((item) => item.slug === slug);
  if (!exhibitor) notFound();
  return <PublicShell><main className="subpage"><section className="subpage-hero"><p className="overline">{exhibitor.category}</p><h1>{exhibitor.name}</h1><p>{exhibitor.description}</p></section></main></PublicShell>;
}
