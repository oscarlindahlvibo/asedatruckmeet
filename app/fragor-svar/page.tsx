import { PublicShell } from "@/components/public-shell";
import { faqs } from "@/lib/demo-data";

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <PublicShell>
      <main className="subpage">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="subpage-hero"><p className="overline">FAQ</p><h1>Frågor & svar</h1><p>FAQ-modulen är kategoriserad, sorterbar och publicerbar från admin.</p></section>
        <section className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
      </main>
    </PublicShell>
  );
}
