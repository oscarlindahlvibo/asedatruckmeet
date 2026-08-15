import { prisma } from "@/lib/prisma";

export type VisitSection = { title: string; text: string };

export async function getPublishedCmsPage(slug: string) {
  try {
    return await prisma.cmsPage.findFirst({ where: { slug, status: "PUBLISHED" }, orderBy: { updatedAt: "desc" } });
  } catch {
    return null;
  }
}

export function readVisitSections(body: unknown): VisitSection[] | null {
  if (!body || typeof body !== "object" || !("sections" in body) || !Array.isArray(body.sections)) return null;
  const sections = body.sections.filter((section): section is VisitSection => Boolean(section && typeof section === "object" && "title" in section && "text" in section && typeof section.title === "string" && typeof section.text === "string"));
  return sections.length ? sections : null;
}
