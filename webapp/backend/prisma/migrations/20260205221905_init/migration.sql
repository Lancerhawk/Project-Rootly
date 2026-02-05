-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "github_user_id" INTEGER NOT NULL,
    "github_username" TEXT NOT NULL,
    "github_email" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "repo_full_name" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'vercel',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "repo_full_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "summary" TEXT NOT NULL,
    "file_path" TEXT,
    "line_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_github_user_id_key" ON "users"("github_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_project_id_key" ON "projects"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_repo_full_name_key" ON "projects"("repo_full_name");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_project_id_key" ON "api_keys"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_incident_id_key" ON "incidents"("incident_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
