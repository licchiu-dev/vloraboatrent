CREATE TABLE "WhatsappClickEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsappClickEvent_pkey" PRIMARY KEY ("id")
);
