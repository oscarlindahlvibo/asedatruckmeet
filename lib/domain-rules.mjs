export const eventStages = [
  "DRAFT",
  "ANNOUNCED",
  "TICKETS_COMING",
  "TICKETS_ON_SALE",
  "EVENT_WEEK",
  "LIVE",
  "FINISHED",
];

export const rolePermissions = {
  SUPER_ADMIN: ["*"],
  EVENT_ADMIN: [
    "event:read",
    "event:update",
    "cms:write",
    "orders:read",
    "trucks:moderate",
    "map:write",
    "votes:admin",
    "system:read",
  ],
  CONTENT_EDITOR: ["event:read", "cms:write", "media:write"],
  TICKET_ADMIN: ["event:read", "orders:read", "orders:pretix-action"],
  TRUCK_MODERATOR: ["event:read", "trucks:moderate"],
  MAP_EDITOR: ["event:read", "map:write"],
  VOTE_ADMIN: ["event:read", "votes:admin"],
  STAFF_READONLY: ["event:read", "orders:read", "system:read"],
};

export function hasPermission(roles, permission) {
  return roles.some((role) => {
    const permissions = rolePermissions[role] ?? [];
    return permissions.includes("*") || permissions.includes(permission);
  });
}

export function canShowTruckPublicly(truck) {
  return (
    truck.status === "APPROVED" &&
    truck.publicConsent === true &&
    truck.publicProfile === true
  );
}

export function getPublicTruckView(truck) {
  if (!canShowTruckPublicly(truck)) {
    return null;
  }

  return {
    truckNumber: truck.truckNumber,
    slug: truck.slug,
    companyName: truck.companyName,
    city: truck.city,
    country: truck.country,
    brand: truck.brand,
    model: truck.model,
    modelYear: truck.modelYear,
    category: truck.category,
    competitionClass: truck.competitionClass,
    description: truck.description,
    instagramUrl: truck.instagramUrl,
    facebookUrl: truck.facebookUrl,
    websiteUrl: truck.websiteUrl,
    registrationNumber: truck.publicRegistration
      ? truck.registrationNumber
      : undefined,
  };
}

export function canAccessOrder(user, order) {
  if (!user || !order) {
    return false;
  }

  if (hasPermission(user.roles ?? [], "orders:read")) {
    return true;
  }

  return order.userLinks?.some((link) => link.userId === user.id) === true;
}

export function canVote({ poll, existingVotesForVoter, now, hasTicket }) {
  const currentTime = now instanceof Date ? now : new Date(now);

  if (currentTime < new Date(poll.opensAt)) {
    return { ok: false, reason: "NOT_OPEN" };
  }

  if (currentTime > new Date(poll.closesAt)) {
    return { ok: false, reason: "CLOSED" };
  }

  if (poll.verificationMode === "TICKET_REQUIRED" && !hasTicket) {
    return { ok: false, reason: "TICKET_REQUIRED" };
  }

  if (existingVotesForVoter >= poll.maxVotes) {
    return { ok: false, reason: "LIMIT_REACHED" };
  }

  return { ok: true };
}

export function webhookIdempotencyKey(payload) {
  if (payload.notification_id != null) {
    return String(payload.notification_id);
  }

  return [
    payload.organizer ?? "unknown",
    payload.event ?? "unknown",
    payload.code ?? "none",
    payload.action ?? "unknown",
    payload.orderposition_id ?? "none",
    payload.checkin_list ?? "none",
  ].join(":");
}
