import { prisma } from "@/lib/prisma";
import { processPretixWebhook } from "@/lib/pretix-sync";

console.log("Åseda Truckmeet worker ready");

async function processBatch() {
  const events = await prisma.pretixWebhookEvent.findMany({ where: { status: { in: ["RECEIVED", "QUEUED"] } }, orderBy: { receivedAt: "asc" }, take: 20 });
  for (const event of events) {
    try { await processPretixWebhook(event.id); }
    catch (error) { await prisma.pretixWebhookEvent.update({ where: { id: event.id }, data: { status: "FAILED", error: error instanceof Error ? error.message : "Unknown worker error" } }); }
  }
}

void processBatch();

setInterval(() => {
  void processBatch();
  console.log(JSON.stringify({ level: "info", service: "worker", heartbeat: new Date().toISOString() }));
}, 60_000);
