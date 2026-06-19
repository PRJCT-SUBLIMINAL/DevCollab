CREATE TABLE "dev_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" varchar(256) NOT NULL,
	"bio" text,
	"skills" json,
	CONSTRAINT "dev_profiles_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "dev_profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" RENAME COLUMN "revokedAt" TO "revoked_at";--> statement-breakpoint
ALTER TABLE "dev_profiles" ADD CONSTRAINT "dev_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;