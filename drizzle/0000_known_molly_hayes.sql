-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."notification_type" AS ENUM('daily', 'review', 'target');--> statement-breakpoint
CREATE TYPE "public"."query_type" AS ENUM('self_stats', 'team_stats', 'person_stats', 'summary');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user', 'manager');--> statement-breakpoint
CREATE TYPE "public"."tag_type" AS ENUM('Fullstack', 'DevOps', 'Backend', 'Frontend', 'Pixi', 'Docs', 'Emergency', 'WithoutTesting', 'WithoutMediaTesting', 'TLReview', 'Bug');--> statement-breakpoint
CREATE TYPE "public"."vacancy" AS ENUM('Frontend', 'Backend', 'DevOps', 'Project Manager', 'Pixi', 'Fullstack', 'Docs', 'Technical Director');--> statement-breakpoint
CREATE TABLE "mr_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_comments" smallint DEFAULT 0 NOT NULL,
	"unresolved_comments" smallint DEFAULT 0 NOT NULL,
	"total_reviewers" smallint DEFAULT 0 NOT NULL,
	"branch_behind_by" smallint DEFAULT 0 NOT NULL,
	"has_conflicts" boolean DEFAULT false NOT NULL,
	"changed_files_count" smallint DEFAULT 0 NOT NULL,
	"additions" integer DEFAULT 0 NOT NULL,
	"deletions" integer DEFAULT 0 NOT NULL,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"task_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" varchar(255) NOT NULL,
	"type" varchar NOT NULL,
	"local_path" text NOT NULL,
	"task_id" integer NOT NULL,
	CONSTRAINT "attachments_local_path_unique" UNIQUE("local_path")
);
--> statement-breakpoint
CREATE TABLE "task_tags" (
	"task_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "task_tags_task_id_tag_id_unique" UNIQUE("task_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "review_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"mr_review_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "review_stats_mr_review_id_user_id_unique" UNIQUE("mr_review_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "task_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"type" varchar NOT NULL,
	"task_id" integer NOT NULL,
	CONSTRAINT "task_messages_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "tag_type" NOT NULL,
	"weeek_id" integer,
	CONSTRAINT "tags_type_unique" UNIQUE("type"),
	CONSTRAINT "tags_weeek_id_type_unique" UNIQUE("type","weeek_id"),
	CONSTRAINT "tags_weeek_id_unique" UNIQUE("weeek_id")
);
--> statement-breakpoint
CREATE TABLE "mr_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"comment_link" varchar(255) NOT NULL,
	"assigned_user_id" integer NOT NULL,
	"mr_review_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_commented_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"mr_review_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mr_reviewers" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"mr_review_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"total" integer DEFAULT 0 NOT NULL,
	"task_url" varchar(255) DEFAULT NULL,
	"is_needed" boolean DEFAULT false NOT NULL,
	"is_started" boolean DEFAULT false NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"task_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"link" varchar(255) NOT NULL,
	"is_completed" boolean NOT NULL,
	"test_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"telegram_id" bigint NOT NULL,
	"telegram_username" varchar(32) NOT NULL,
	"gitlab_id" integer NOT NULL,
	"weeek_id" varchar NOT NULL,
	"birthday" timestamp NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id"),
	CONSTRAINT "users_telegram_username_unique" UNIQUE("telegram_username"),
	CONSTRAINT "users_gitlab_id_unique" UNIQUE("gitlab_id"),
	CONSTRAINT "users_weeek_id_unique" UNIQUE("weeek_id")
);
--> statement-breakpoint
CREATE TABLE "user_work_hours" (
	"user_id" integer NOT NULL,
	"start_day" date NOT NULL,
	"end_day" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vacancies" (
	"user_id" integer NOT NULL,
	"vacancy" "vacancy" NOT NULL,
	CONSTRAINT "user_vacancies_user_id_vacancy_unique" UNIQUE("user_id","vacancy")
);
--> statement-breakpoint
CREATE TABLE "queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"query_type" "query_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"vacancy" "vacancy",
	"target_user_id" integer
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"weeek_id" integer NOT NULL,
	"mr_id" integer,
	"mr_url" varchar(255),
	"task_url" varchar(255),
	"is_emergency" boolean DEFAULT false NOT NULL,
	"message_caption" text NOT NULL,
	"created_at" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "tasks_weeek_id_unique" UNIQUE("weeek_id")
);
--> statement-breakpoint
CREATE TABLE "assignees" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "assignees_task_id_user_id_unique" UNIQUE("task_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"is_repeatable" boolean DEFAULT false NOT NULL,
	"interval" integer,
	"end_date" timestamp,
	"start_date" timestamp,
	"notification_type" "notification_type" NOT NULL,
	"vacancy" "vacancy",
	"author_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"query_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mr_reviews" ADD CONSTRAINT "mr_reviews_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_tags" ADD CONSTRAINT "task_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "review_stats" ADD CONSTRAINT "review_stats_mr_review_id_mr_reviews_id_fk" FOREIGN KEY ("mr_review_id") REFERENCES "public"."mr_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "review_stats" ADD CONSTRAINT "review_stats_user_id_users_gitlab_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("gitlab_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "task_messages" ADD CONSTRAINT "task_messages_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_comments" ADD CONSTRAINT "mr_comments_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_comments" ADD CONSTRAINT "mr_comments_mr_review_id_mr_reviews_id_fk" FOREIGN KEY ("mr_review_id") REFERENCES "public"."mr_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_commented_users" ADD CONSTRAINT "mr_commented_users_mr_review_id_mr_reviews_id_fk" FOREIGN KEY ("mr_review_id") REFERENCES "public"."mr_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_commented_users" ADD CONSTRAINT "mr_commented_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_reviewers" ADD CONSTRAINT "mr_reviewers_mr_review_id_mr_reviews_id_fk" FOREIGN KEY ("mr_review_id") REFERENCES "public"."mr_reviews"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "mr_reviewers" ADD CONSTRAINT "mr_reviewers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "test_detail" ADD CONSTRAINT "test_detail_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_work_hours" ADD CONSTRAINT "user_work_hours_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_vacancies" ADD CONSTRAINT "user_vacancies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "queries" ADD CONSTRAINT "queries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "queries" ADD CONSTRAINT "queries_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignees" ADD CONSTRAINT "assignees_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "assignees" ADD CONSTRAINT "assignees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_query_id_queries_id_fk" FOREIGN KEY ("query_id") REFERENCES "public"."queries"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
*/