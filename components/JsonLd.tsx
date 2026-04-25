// Renders a <script type="application/ld+json"> with the given JSON object.
// Server-component compatible; safe to use in any layout/page.

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
