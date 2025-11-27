/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" VARCHAR(255),
ADD COLUMN     "password" VARCHAR(255),
ADD COLUMN     "role" VARCHAR(50) NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
