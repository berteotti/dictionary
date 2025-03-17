CREATE TABLE "Word" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"definition" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
