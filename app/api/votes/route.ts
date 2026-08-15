import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canVote } from "@/lib/domain-rules.mjs";

const schema = z.object({ pollId: z.string().cuid(), truckProfileId: z.string().cuid() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Logga in för att rösta." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Ogiltig röst." }, { status: 400 });
  const poll = await prisma.votePoll.findUnique({ where: { id: parsed.data.pollId } });
  const truck = await prisma.truckProfile.findUnique({ where: { id: parsed.data.truckProfileId } });
  if (!poll || !truck || truck.eventId !== poll.eventId || truck.status !== "APPROVED" || !truck.publicConsent) return NextResponse.json({ error: "Lastbilen kan inte få röster just nu." }, { status: 400 });
  const voterHash = createHash("sha256").update(`${poll.id}:${user.id}`).digest("hex");
  const existingVotes = await prisma.vote.count({ where: { pollId: poll.id, voterHash } });
  const ticket = await prisma.userOrderLink.findFirst({ where: { userId: user.id, order: { eventId: poll.eventId, status: { in: ["paid", "pending"] } } } });
  const decision = canVote({ poll, existingVotesForVoter: existingVotes, now: new Date(), hasTicket: Boolean(ticket) });
  if (!decision.ok) return NextResponse.json({ error: decision.reason }, { status: 409 });
  await prisma.vote.create({ data: { pollId: poll.id, truckProfileId: truck.id, voterHash, ticketHash: ticket ? createHash("sha256").update(ticket.orderId).digest("hex") : null, abuseSignals: { source: "account" } } });
  return NextResponse.json({ ok: true });
}
