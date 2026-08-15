-- Aseda Truckmeet foundation. Isolated schema for the shared Supabase PostgreSQL instance.
CREATE SCHEMA IF NOT EXISTS "truckmeet";
SET search_path TO "truckmeet", public;

-- CreateEnum
CREATE TYPE "EventStage" AS ENUM ('DRAFT', 'ANNOUNCED', 'TICKETS_COMING', 'TICKETS_ON_SALE', 'EVENT_WEEK', 'LIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_EDITOR', 'TICKET_ADMIN', 'TRUCK_MODERATOR', 'MAP_EDITOR', 'VOTE_ADMIN', 'STAFF_READONLY');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TruckProfileStatus" AS ENUM ('INCOMPLETE', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "VoteVerificationMode" AS ENUM ('OPEN', 'EMAIL_REQUIRED', 'TICKET_REQUIRED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stage" "EventStage" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "ticketSalesOpenAt" TIMESTAMP(3),
    "locationName" TEXT NOT NULL,
    "locationAddress" TEXT,
    "heroTitle" TEXT NOT NULL,
    "heroKicker" TEXT,
    "heroLead" TEXT NOT NULL,
    "heroMediaAssetId" TEXT,
    "featuredVideoUrl" TEXT,
    "pretixOrganizerSlug" TEXT,
    "pretixEventSlug" TEXT,
    "pretixEventUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "roles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsPage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT,
    "body" JSONB NOT NULL,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "previewToken" TEXT,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "publicUrl" TEXT,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "credit" TEXT,
    "variants" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerTier" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PartnerTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "tierId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "logoAssetId" TEXT,
    "coverAssetId" TEXT,
    "booth" TEXT,
    "mapPoiId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exhibitor" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "websiteUrl" TEXT,
    "logoAssetId" TEXT,
    "booth" TEXT,
    "mapPoiId" TEXT,
    "offer" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Exhibitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "imageAssetId" TEXT,
    "spotifyUrl" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "websiteUrl" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "artistId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "category" TEXT,
    "imageAssetId" TEXT,
    "externalUrl" TEXT,
    "status" "PublicationStatus" NOT NULL DEFAULT 'PUBLISHED',

    CONSTRAINT "ProgramItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "FaqCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "categoryId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "body" JSONB NOT NULL,
    "imageAssetId" TEXT,
    "status" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "caption" TEXT,
    "photographer" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckProfile" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "pretixOrderCode" TEXT,
    "pretixPositionId" INTEGER,
    "truckNumber" TEXT,
    "slug" TEXT NOT NULL,
    "companyName" TEXT,
    "driverName" TEXT,
    "registrationNumber" TEXT,
    "publicRegistration" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "city" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "modelYear" INTEGER,
    "engineType" TEXT,
    "enginePower" TEXT,
    "vehicleHeight" TEXT,
    "vehicleLength" TEXT,
    "shirtSize" TEXT,
    "bodywork" TEXT,
    "category" TEXT,
    "competitionClass" TEXT,
    "description" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "websiteUrl" TEXT,
    "photographer" TEXT,
    "registrationData" JSONB,
    "mainImageAssetId" TEXT,
    "publicConsent" BOOLEAN NOT NULL DEFAULT false,
    "status" "TruckProfileStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "area" TEXT,
    "row" TEXT,
    "placeNumber" TEXT,
    "mapPoiId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TruckProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckProfileMedia" (
    "id" TEXT NOT NULL,
    "truckProfileId" TEXT NOT NULL,
    "mediaAssetId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "TruckProfileMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventMap" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseAssetId" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "EventMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapPoi" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "openingHours" TEXT,
    "linkUrl" TEXT,

    CONSTRAINT "MapPoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapRoute" (
    "id" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "path" JSONB NOT NULL,

    CONSTRAINT "MapRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrSign" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "scans" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrSign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotePoll" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "opensAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "maxVotes" INTEGER NOT NULL DEFAULT 1,
    "verificationMode" "VoteVerificationMode" NOT NULL DEFAULT 'EMAIL_REQUIRED',
    "includedCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publicResultsAt" TIMESTAMP(3),

    CONSTRAINT "VotePoll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "truckProfileId" TEXT NOT NULL,
    "voterHash" TEXT NOT NULL,
    "ticketHash" TEXT,
    "abuseSignals" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PretixOrderReadModel" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "organizerSlug" TEXT NOT NULL,
    "pretixEventSlug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "buyerEmail" TEXT,
    "buyerName" TEXT,
    "status" TEXT NOT NULL,
    "total" TEXT,
    "currency" TEXT,
    "raw" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PretixOrderReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PretixOrderPositionReadModel" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "pretixPositionId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "variationId" INTEGER,
    "itemName" TEXT,
    "admission" BOOLEAN NOT NULL DEFAULT false,
    "secretHash" TEXT,
    "checkinState" TEXT,
    "raw" JSONB NOT NULL,

    CONSTRAINT "PretixOrderPositionReadModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOrderLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOrderLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PretixWebhookEvent" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "notificationId" TEXT,
    "action" TEXT NOT NULL,
    "organizerSlug" TEXT,
    "eventSlug" TEXT,
    "orderCode" TEXT,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PretixWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationError" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PretixSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "baseUrl" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "publicEventUrl" TEXT NOT NULL,
    "encryptedApiToken" TEXT,
    "tokenConfigured" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PretixSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "subject" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_year_key" ON "Event"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_tokenHash_key" ON "MagicLinkToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "CmsPage_previewToken_key" ON "CmsPage"("previewToken");

-- CreateIndex
CREATE UNIQUE INDEX "CmsPage_eventId_slug_key" ON "CmsPage"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerTier_eventId_slug_key" ON "PartnerTier"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_eventId_slug_key" ON "Partner"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Exhibitor_eventId_slug_key" ON "Exhibitor"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_eventId_slug_key" ON "Artist"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramItem_eventId_slug_key" ON "ProgramItem"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "FaqCategory_slug_key" ON "FaqCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_slug_key" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TruckProfile_eventId_slug_key" ON "TruckProfile"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "TruckProfile_eventId_truckNumber_key" ON "TruckProfile"("eventId", "truckNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MapPoi_mapId_slug_key" ON "MapPoi"("mapId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "MapRoute_mapId_slug_key" ON "MapRoute"("mapId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "QrSign_trackingCode_key" ON "QrSign"("trackingCode");

-- CreateIndex
CREATE UNIQUE INDEX "VotePoll_eventId_slug_key" ON "VotePoll"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollId_voterHash_truckProfileId_key" ON "Vote"("pollId", "voterHash", "truckProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "PretixOrderReadModel_organizerSlug_pretixEventSlug_code_key" ON "PretixOrderReadModel"("organizerSlug", "pretixEventSlug", "code");

-- CreateIndex
CREATE UNIQUE INDEX "PretixOrderPositionReadModel_orderId_pretixPositionId_key" ON "PretixOrderPositionReadModel"("orderId", "pretixPositionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOrderLink_userId_orderId_key" ON "UserOrderLink"("userId", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PretixWebhookEvent_idempotencyKey_key" ON "PretixWebhookEvent"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "PretixWebhookEvent_notificationId_key" ON "PretixWebhookEvent"("notificationId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmsPage" ADD CONSTRAINT "CmsPage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerTier" ADD CONSTRAINT "PartnerTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PartnerTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibitor" ADD CONSTRAINT "Exhibitor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramItem" ADD CONSTRAINT "ProgramItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramItem" ADD CONSTRAINT "ProgramItem_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FaqCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckProfile" ADD CONSTRAINT "TruckProfile_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckProfile" ADD CONSTRAINT "TruckProfile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckProfileMedia" ADD CONSTRAINT "TruckProfileMedia_truckProfileId_fkey" FOREIGN KEY ("truckProfileId") REFERENCES "TruckProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMap" ADD CONSTRAINT "EventMap_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPoi" ADD CONSTRAINT "MapPoi_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "EventMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapRoute" ADD CONSTRAINT "MapRoute_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "EventMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotePoll" ADD CONSTRAINT "VotePoll_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "VotePoll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_truckProfileId_fkey" FOREIGN KEY ("truckProfileId") REFERENCES "TruckProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PretixOrderReadModel" ADD CONSTRAINT "PretixOrderReadModel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PretixOrderPositionReadModel" ADD CONSTRAINT "PretixOrderPositionReadModel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PretixOrderReadModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrderLink" ADD CONSTRAINT "UserOrderLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrderLink" ADD CONSTRAINT "UserOrderLink_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "PretixOrderReadModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
