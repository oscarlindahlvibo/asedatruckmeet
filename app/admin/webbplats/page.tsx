import { AdminCmsEditor } from "@/components/admin-cms-editor";

export default function Page() {
  return <section className="admin-page"><p className="overline">Strukturerat CMS</p><h1>Webbplats</h1><p className="admin-lead">Redigera innehåll utan page builder-sprawl. Draft och publicering sparas med audit logg.</p><AdminCmsEditor /></section>;
}
