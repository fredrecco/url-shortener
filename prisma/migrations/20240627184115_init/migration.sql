-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "expanded" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shortened" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserValidation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserValidation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecover" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL,

    CONSTRAINT "UserRecover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLogoutToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "disconnected" BOOLEAN NOT NULL,
    "disconnectedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLogoutToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortened_key" ON "Url"("shortened");

-- CreateIndex
CREATE UNIQUE INDEX "UserValidation_token_key" ON "UserValidation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecover_token_key" ON "UserRecover"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserLogoutToken_token_key" ON "UserLogoutToken"("token");

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserValidation" ADD CONSTRAINT "UserValidation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
