ALTER TABLE "user_work_hours" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "queries" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "history" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_work_hours" CASCADE;--> statement-breakpoint
DROP TABLE "queries" CASCADE;--> statement-breakpoint
DROP TABLE "notifications" CASCADE;--> statement-breakpoint
DROP TABLE "history" CASCADE;--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_weeek_id_type_unique";--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_weeek_id_type_unique" UNIQUE("weeek_id","type");--> statement-breakpoint
DROP TYPE "public"."notification_type";--> statement-breakpoint
DROP TYPE "public"."query_type";