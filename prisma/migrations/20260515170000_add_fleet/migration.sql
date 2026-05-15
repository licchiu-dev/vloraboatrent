CREATE TYPE "FleetCategory" AS ENUM ('BARCA', 'GOMMONE');

CREATE TABLE "FleetAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FleetCategory" NOT NULL,
    "pricingProductId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookingFleetAssignment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "fleetAssetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingFleetAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FleetAsset_name_key" ON "FleetAsset"("name");
CREATE UNIQUE INDEX "BookingFleetAssignment_bookingId_fleetAssetId_key" ON "BookingFleetAssignment"("bookingId", "fleetAssetId");

ALTER TABLE "FleetAsset"
ADD CONSTRAINT "FleetAsset_pricingProductId_fkey"
FOREIGN KEY ("pricingProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BookingFleetAssignment"
ADD CONSTRAINT "BookingFleetAssignment_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BookingFleetAssignment"
ADD CONSTRAINT "BookingFleetAssignment_fleetAssetId_fkey"
FOREIGN KEY ("fleetAssetId") REFERENCES "FleetAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
