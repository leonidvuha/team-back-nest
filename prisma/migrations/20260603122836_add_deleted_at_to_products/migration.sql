-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "lat" SET DATA TYPE TEXT,
ALTER COLUMN "lng" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "about_me" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT;
