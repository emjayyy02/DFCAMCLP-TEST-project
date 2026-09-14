CREATE TYPE "public"."portal_code" AS ENUM('APPLICANT', 'STUDENT', 'ACADEMIC', 'RECORDS', 'OPERATIONS', 'TECHNOLOGY');--> statement-breakpoint
CREATE TABLE "membership_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portal_membership_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"portal" "portal_code" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "membership_roles_membership_role_unique" UNIQUE("portal_membership_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL,
	"label" varchar(120) NOT NULL,
	"portal" "portal_code" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_code_unique" UNIQUE("code"),
	CONSTRAINT "permissions_id_portal_unique" UNIQUE("id","portal")
);
--> statement-breakpoint
CREATE TABLE "portal_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_account_id" text NOT NULL,
	"portal" "portal_code" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portal_memberships_account_portal_unique" UNIQUE("application_account_id","portal"),
	CONSTRAINT "portal_memberships_id_portal_unique" UNIQUE("id","portal")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"portal" "portal_code" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_permission_unique" UNIQUE("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"label" varchar(100) NOT NULL,
	"portal" "portal_code" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_code_unique" UNIQUE("code"),
	CONSTRAINT "roles_id_portal_unique" UNIQUE("id","portal")
);
--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "membership_roles_membership_portal_fk" FOREIGN KEY ("portal_membership_id","portal") REFERENCES "public"."portal_memberships"("id","portal") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "membership_roles" ADD CONSTRAINT "membership_roles_role_portal_fk" FOREIGN KEY ("role_id","portal") REFERENCES "public"."roles"("id","portal") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "portal_memberships" ADD CONSTRAINT "portal_memberships_application_account_id_application_accounts_auth_user_id_fk" FOREIGN KEY ("application_account_id") REFERENCES "public"."application_accounts"("auth_user_id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_portal_fk" FOREIGN KEY ("role_id","portal") REFERENCES "public"."roles"("id","portal") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_portal_fk" FOREIGN KEY ("permission_id","portal") REFERENCES "public"."permissions"("id","portal") ON DELETE restrict ON UPDATE restrict;