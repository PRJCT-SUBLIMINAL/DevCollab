CREATE TABLE "refresh_tokens" (
	"user_id" uuid NOT NULL,
	"token" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revokedAt" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;