import { redirect } from "next/navigation";
import { trucks } from "@/lib/demo-data";

export default async function TruckNumberRedirect({ params }: { params: Promise<{ truckNumber: string }> }) {
  const { truckNumber } = await params;
  const truck = trucks.find(
    (item) => item.truckNumber.toLowerCase() === truckNumber.toLowerCase(),
  );

  redirect(truck ? `/lastbilar/${truck.slug}` : "/lastbilar");
}
