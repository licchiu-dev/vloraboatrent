CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'PARTNER', 'MOLO');

ALTER TABLE "Booking"
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MOLO';
