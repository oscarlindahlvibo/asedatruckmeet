import type { ShopProduct } from "@/lib/ticket-shop";

export function TicketCatalog({ products }: { products: ShopProduct[] }) {
  const groups = ["Besökare", "Fordon", "Tillägg"]
    .map((category) => ({ category, products: products.filter((product) => product.category === category) }))
    .filter((group) => group.products.length > 0);

  return (
    <div className="ticket-catalog">
      {groups.map((group) => (
        <section className="ticket-category" key={group.category}>
          <div className="ticket-category-heading">
            <p className="overline">{group.category}</p>
            <span>{group.products.length} produkter</span>
          </div>
          <div className="ticket-product-grid">
            {group.products.map((product) => (
              <article className="ticket-product-card" key={product.id}>
                <div className="ticket-product-art" aria-hidden="true">
                  <span>{product.isVehicle ? "TRUCK" : "PASS"}</span>
                  <strong>{String(product.id).padStart(2, "0")}</strong>
                </div>
                <div className="ticket-product-body">
                  <div className="ticket-product-topline">
                    <span className="ticket-product-type">{product.isVehicle ? "Fordonsanmälan" : "Biljett"}</span>
                    {product.available !== null && <span className="ticket-product-stock">{product.available} kvar</span>}
                  </div>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <div className="ticket-product-footer">
                    <strong>{product.price ?? "Pris i checkout"}</strong>
                    <a className="btn btn-primary" href="#pretix-checkout">Välj biljett</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
