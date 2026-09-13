CREATE TYPE "public"."applicant_profile_status" AS ENUM('DRAFT', 'ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."institutional_profile_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "campuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"short_name" varchar(100),
	"location_label" varchar(160),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campuses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "program_majors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "program_majors_program_code_unique" UNIQUE("program_id","code"),
	CONSTRAINT "program_majors_id_program_unique" UNIQUE("id","program_id")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campus_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(200) NOT NULL,
	"short_name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"middle_name" varchar(100),
	"last_name" varchar(100) NOT NULL,
	"suffix" varchar(30),
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applicant_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"applicant_number" varchar(64),
	"selected_program_id" uuid,
	"selected_major_id" uuid,
	"application_status" "applicant_profile_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applicant_profiles_person_unique" UNIQUE("person_id"),
	CONSTRAINT "applicant_profiles_number_unique" UNIQUE("applicant_number"),
	CONSTRAINT "applicant_profiles_major_requires_program_check" CHECK ("applicant_profiles"."selected_major_id" is null or "applicant_profiles"."selected_program_id" is not null)
);
--> statement-breakpoint
CREATE TABLE "employee_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"employee_number" varchar(64),
	"department_label" varchar(160),
	"position_title" varchar(160),
	"employment_status" "institutional_profile_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employee_profiles_person_unique" UNIQUE("person_id"),
	CONSTRAINT "employee_profiles_number_unique" UNIQUE("employee_number")
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"student_number" varchar(64),
	"program_id" uuid NOT NULL,
	"major_id" uuid,
	"year_level" integer,
	"student_status" "institutional_profile_status" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_profiles_person_unique" UNIQUE("person_id"),
	CONSTRAINT "student_profiles_number_unique" UNIQUE("student_number"),
	CONSTRAINT "student_profiles_year_level_positive_check" CHECK ("student_profiles"."year_level" is null or "student_profiles"."year_level" > 0)
);
--> statement-breakpoint
ALTER TABLE "program_majors" ADD CONSTRAINT "program_majors_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_selected_program_id_programs_id_fk" FOREIGN KEY ("selected_program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "applicant_profiles" ADD CONSTRAINT "applicant_profiles_major_program_fk" FOREIGN KEY ("selected_major_id","selected_program_id") REFERENCES "public"."program_majors"("id","program_id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "employee_profiles" ADD CONSTRAINT "employee_profiles_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE restrict ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_major_program_fk" FOREIGN KEY ("major_id","program_id") REFERENCES "public"."program_majors"("id","program_id") ON DELETE restrict ON UPDATE restrict;