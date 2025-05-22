CREATE TABLE "teste" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"data_criacao" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "login" (
	"username" varchar(255) PRIMARY KEY NOT NULL,
	"password" varchar(10) NOT NULL,
	"user_type" integer NOT NULL
);

-- Insert test user (admin)
INSERT INTO "login" ("username", "password", "user_type") 
VALUES ('admin', '123456', 0);

CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"status" varchar(10) NOT NULL,
	"priority" integer NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"description" varchar(4000),
	"category" varchar(255) NOT NULL,
	"last_reply" varchar(4000) DEFAULT NULL,
	"date_updated" timestamp DEFAULT now(),
	"date_finished" timestamp DEFAULT NULL
);

CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" varchar(255) NOT NULL,
	"description" varchar(4000) NOT NULL,
	"status" varchar(10) NOT NULL,
	"priority" integer NOT NULL,
	"date_created" timestamp DEFAULT now() NOT NULL,
	"date_updated" timestamp DEFAULT now(),
	"date_delivered" timestamp DEFAULT NULL,
	"date_deadline" timestamp DEFAULT NULL
);
