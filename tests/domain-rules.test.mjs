import assert from "node:assert/strict";
import test from "node:test";
import {
  canAccessOrder,
  canShowTruckPublicly,
  canVote,
  getPublicTruckView,
  hasPermission,
  webhookIdempotencyKey,
} from "../lib/domain-rules.mjs";

test("RBAC grants least-privilege permissions", () => {
  assert.equal(hasPermission(["CONTENT_EDITOR"], "cms:write"), true);
  assert.equal(hasPermission(["CONTENT_EDITOR"], "orders:pretix-action"), false);
  assert.equal(hasPermission(["SUPER_ADMIN"], "orders:pretix-action"), true);
});

test("users can only access linked orders unless admin", () => {
  const user = { id: "user-1", roles: [] };
  const other = { id: "user-2", roles: [] };
  const admin = { id: "admin", roles: ["TICKET_ADMIN"] };
  const order = { userLinks: [{ userId: "user-1" }] };

  assert.equal(canAccessOrder(user, order), true);
  assert.equal(canAccessOrder(other, order), false);
  assert.equal(canAccessOrder(admin, order), true);
});

test("truck public view hides private data", () => {
  const truck = {
    status: "APPROVED",
    publicConsent: true,
    publicProfile: true,
    publicRegistration: false,
    registrationNumber: "ABC123",
    truckNumber: "B127",
    slug: "b127-demo",
    companyName: "Demo Åkeri",
  };

  assert.equal(canShowTruckPublicly(truck), true);
  assert.equal(getPublicTruckView(truck).registrationNumber, undefined);
});

test("voting enforces time, ticket requirement and limits", () => {
  const poll = {
    opensAt: "2027-07-02T10:00:00+02:00",
    closesAt: "2027-07-03T23:00:00+02:00",
    maxVotes: 1,
    verificationMode: "TICKET_REQUIRED",
  };

  assert.equal(canVote({ poll, existingVotesForVoter: 0, now: "2027-07-01T10:00:00+02:00", hasTicket: true }).reason, "NOT_OPEN");
  assert.equal(canVote({ poll, existingVotesForVoter: 0, now: "2027-07-02T12:00:00+02:00", hasTicket: false }).reason, "TICKET_REQUIRED");
  assert.equal(canVote({ poll, existingVotesForVoter: 1, now: "2027-07-02T12:00:00+02:00", hasTicket: true }).reason, "LIMIT_REACHED");
  assert.equal(canVote({ poll, existingVotesForVoter: 0, now: "2027-07-02T12:00:00+02:00", hasTicket: true }).ok, true);
});

test("pretix webhook idempotency prefers notification id", () => {
  assert.equal(webhookIdempotencyKey({ notification_id: 123, action: "x" }), "123");
  assert.equal(
    webhookIdempotencyKey({ organizer: "atm", event: "2027", code: "AB12", action: "pretix.event.order.paid" }),
    "atm:2027:AB12:pretix.event.order.paid:none:none",
  );
});
