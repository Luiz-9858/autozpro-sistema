-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "version" TEXT,
    "engine" TEXT,
    "fuelType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_vehicles" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vehicles_brand_idx" ON "vehicles"("brand");

-- CreateIndex
CREATE INDEX "vehicles_model_idx" ON "vehicles"("model");

-- CreateIndex
CREATE INDEX "vehicles_year_idx" ON "vehicles"("year");

-- CreateIndex
CREATE INDEX "vehicles_brand_model_year_idx" ON "vehicles"("brand", "model", "year");

-- CreateIndex
CREATE INDEX "product_vehicles_productId_idx" ON "product_vehicles"("productId");

-- CreateIndex
CREATE INDEX "product_vehicles_vehicleId_idx" ON "product_vehicles"("vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "product_vehicles_productId_vehicleId_key" ON "product_vehicles"("productId", "vehicleId");

-- AddForeignKey
ALTER TABLE "product_vehicles" ADD CONSTRAINT "product_vehicles_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_vehicles" ADD CONSTRAINT "product_vehicles_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
