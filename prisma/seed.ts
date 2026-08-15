import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "node:fs";
import path from "node:path";
import {
  currentEvent,
  exhibitors,
  faqs,
  partnerTiers,
  partners,
  programItems,
  trucks,
} from "../lib/demo-data";

const legacySponsors = JSON.parse(fs.readFileSync(path.resolve("data/legacy-sponsors.json"), "utf8")).sponsors as Array<{ name: string; slug: string; tier: string; description: string; websiteUrl: string | null; logoPath: string | null }>;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "postgresql://localhost:5432/truckmeet" }),
});

async function main() {
  const event = await prisma.event.upsert({
    where: { slug: currentEvent.slug },
    update: {},
    create: {
      year: currentEvent.year,
      name: currentEvent.name,
      slug: currentEvent.slug,
      stage: currentEvent.stage as never,
      startsAt: new Date(currentEvent.startsAt),
      endsAt: new Date(currentEvent.endsAt),
      ticketSalesOpenAt: new Date(currentEvent.ticketSalesOpenAt),
      locationName: currentEvent.locationName,
      locationAddress: currentEvent.locationAddress,
      heroTitle: currentEvent.heroTitle,
      heroKicker: currentEvent.heroKicker,
      heroLead: currentEvent.heroLead,
      pretixEventUrl: currentEvent.pretixEventUrl,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@asedatruckmeet.se" },
    update: { roles: ["SUPER_ADMIN"] },
    create: { email: "admin@asedatruckmeet.se", name: "DEMO Arrangör", roles: ["SUPER_ADMIN"], emailVerified: new Date() },
  });

  for (const tier of partnerTiers) {
    await prisma.partnerTier.upsert({
      where: { eventId_slug: { eventId: event.id, slug: tier.slug } },
      update: {},
      create: { ...tier, eventId: event.id },
    });
  }

  for (const partner of partners) {
    const tier = await prisma.partnerTier.findFirst({
      where: { eventId: event.id, name: partner.tier },
    });
    await prisma.partner.upsert({
      where: { eventId_slug: { eventId: event.id, slug: partner.slug } },
      update: {},
      create: {
        eventId: event.id,
        tierId: tier?.id,
        name: partner.name,
        slug: partner.slug,
        description: partner.description,
        websiteUrl: partner.websiteUrl,
        booth: partner.booth,
      },
    });
  }

  for (const partner of legacySponsors) {
    const tier = await prisma.partnerTier.findFirst({ where: { eventId: event.id, name: partner.tier } });
    const logoAsset = partner.logoPath ? await prisma.mediaAsset.findFirst({ where: { eventId: event.id, publicUrl: partner.logoPath } }) ?? await prisma.mediaAsset.create({ data: { eventId: event.id, bucket: "local-public", objectKey: `public${partner.logoPath}`, publicUrl: partner.logoPath, mimeType: partner.logoPath.endsWith(".svg") ? "image/svg+xml" : "image/webp", sizeBytes: 0 } }) : null;
    await prisma.partner.upsert({
      where: { eventId_slug: { eventId: event.id, slug: partner.slug } },
      update: { tierId: tier?.id, description: partner.description, websiteUrl: partner.websiteUrl, logoAssetId: logoAsset?.id, isPublic: true },
      create: { eventId: event.id, tierId: tier?.id, name: partner.name, slug: partner.slug, description: partner.description, websiteUrl: partner.websiteUrl, logoAssetId: logoAsset?.id, isPublic: true },
    });
  }

  for (const exhibitor of exhibitors) {
    await prisma.exhibitor.upsert({
      where: { eventId_slug: { eventId: event.id, slug: exhibitor.slug } },
      update: {},
      create: {
        eventId: event.id,
        name: exhibitor.name,
        slug: exhibitor.slug,
        category: exhibitor.category,
        description: exhibitor.description,
        websiteUrl: exhibitor.websiteUrl,
        booth: exhibitor.booth,
        offer: "DEMO erbjudande",
      },
    });
  }

  for (const item of programItems) {
    await prisma.programItem.upsert({
      where: { eventId_slug: { eventId: event.id, slug: item.slug } },
      update: {},
      create: {
        eventId: event.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        place: item.place,
        category: item.category,
        startsAt: new Date("2027-07-02T12:00:00+02:00"),
        endsAt: new Date("2027-07-02T13:00:00+02:00"),
      },
    });
  }

  for (const [question, answer] of faqs) {
    await prisma.faqItem.create({
      data: { eventId: event.id, question, answer, isPublished: true },
    });
  }

  for (const truck of trucks) {
    await prisma.truckProfile.upsert({
      where: { eventId_slug: { eventId: event.id, slug: truck.slug } },
      update: {},
      create: {
        eventId: event.id,
        truckNumber: truck.truckNumber,
        slug: truck.slug,
        companyName: truck.companyName,
        registrationNumber: truck.registrationNumber,
        publicRegistration: truck.publicRegistration,
        country: truck.country,
        city: truck.city,
        brand: truck.brand,
        model: truck.model,
        modelYear: truck.modelYear,
        category: truck.category,
        competitionClass: truck.competitionClass,
        description: truck.description,
        instagramUrl: truck.instagramUrl,
        publicConsent: truck.publicConsent,
        status: truck.status as never,
      },
    });
  }

  console.log(`Seeded ${currentEvent.name} with DEMO data`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
