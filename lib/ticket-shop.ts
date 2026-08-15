import { currentEvent } from "@/lib/demo-data";
import { PretixClient, type PretixProduct } from "@/lib/pretix";

export type ShopProduct = {
  id: number;
  name: string;
  description: string;
  price: string | null;
  category: string;
  available: number | null;
  isVehicle: boolean;
};

const demoProducts: ShopProduct[] = [
  { id: 1, name: "Helgpass", description: "Entré till hela Truckmeet-helgen.", price: "495 kr", category: "Besökare", available: null, isVehicle: false },
  { id: 2, name: "Lördagsbiljett", description: "En full dag med showtrucks, krom och folkfest.", price: "295 kr", category: "Besökare", available: null, isVehicle: false },
  { id: 3, name: "Camping", description: "Lägg till camping på ditt besök.", price: "250 kr", category: "Tillägg", available: null, isVehicle: false },
  { id: 4, name: "Utställningslastbil", description: "Anmäl din lastbil till årets Truckmeet.", price: "350 kr", category: "Fordon", available: null, isVehicle: true },
];

function localized(value: PretixProduct["name"]): string {
  if (!value) return "Biljett";
  if (typeof value === "string") return value;
  return value.sv ?? value.en ?? Object.values(value)[0] ?? "Biljett";
}

function plainText(value: PretixProduct["description"]): string {
  if (!value) return "Biljett till Åseda Truckmeet.";
  const text = typeof value === "string" ? value : value.sv ?? value.en ?? Object.values(value)[0] ?? "";
  return text.replace(/[*_`#>-]/g, "").replace(/\s+/g, " ").trim().slice(0, 180) || "Biljett till Åseda Truckmeet.";
}

function categoryFor(product: PretixProduct): string {
  const name = localized(product.name).toLowerCase();
  if (/truck|lastbil|fordon|utställ/.test(name)) return "Fordon";
  if (/camp|park|tillägg|add-on/.test(name)) return "Tillägg";
  return "Besökare";
}

function normalize(product: PretixProduct): ShopProduct {
  const category = categoryFor(product);
  return {
    id: product.id,
    name: localized(product.name),
    description: plainText(product.description),
    price: product.default_price ? `${product.default_price} kr` : null,
    category,
    available: product.available ?? null,
    isVehicle: category === "Fordon",
  };
}

export async function getTicketShopProducts(): Promise<{ products: ShopProduct[]; live: boolean }> {
  const eventSlug = process.env.PRETIX_EVENT_SLUG ?? "2027";
  try {
    const client = new PretixClient();
    const response = await client.listProducts(eventSlug);
    const products = (response.results ?? [])
      .filter((product) => product.active !== false)
      .map(normalize);
    return { products, live: true };
  } catch {
    return { products: demoProducts, live: false };
  }
}

export function getTicketShopCheckoutUrl() {
  return currentEvent.pretixEventUrl;
}
