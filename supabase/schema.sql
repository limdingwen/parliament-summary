
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."refresh_materialized_view"("view_name" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
BEGIN
    EXECUTE 'REFRESH MATERIALIZED VIEW ' || view_name;
END;
$$;

ALTER FUNCTION "public"."refresh_materialized_view"("view_name" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."bill" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "date_introduced" "date" NOT NULL,
    "second_reading_date_type" "text" NOT NULL,
    "second_reading_date" "date",
    "is_passed" boolean NOT NULL,
    "passed_date" "date",
    "pdf_url" "text" NOT NULL,
    "bill_no" "text" NOT NULL,
    "original_text" "text",
    "summary" "text"
);

ALTER TABLE "public"."bill" OWNER TO "postgres";

ALTER TABLE "public"."bill" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Bills_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."bill_full_text_view" WITH ("security_invoker"='on') AS
 SELECT "bill"."bill_no",
    "bill"."name",
    (((((("bill"."bill_no" || ' '::"text") || "bill"."name") || ' '::"text") || COALESCE("bill"."summary", ''::"text")) || ' '::"text") || COALESCE("bill"."original_text", ''::"text")) AS "full_text"
   FROM "public"."bill";

ALTER TABLE "public"."bill_full_text_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."mp" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "gender" "text",
    "date_of_birth" "date",
    "place_of_birth" "text",
    "given_name" "text",
    "family_name" "text",
    "full_name" "text" NOT NULL,
    "party_id" bigint,
    "photo_url" "text",
    "wikidata_id" "text" NOT NULL
);

ALTER TABLE "public"."mp" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."mp_aliases" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "mp_id" bigint NOT NULL,
    "alias_name" "text" NOT NULL
);

ALTER TABLE "public"."mp_aliases" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."combined_mp_names_view" WITH ("security_invoker"='on') AS
 SELECT DISTINCT "m"."id" AS "mp_id",
    "m"."full_name",
    "a"."alias_name"
   FROM ("public"."mp" "m"
     LEFT JOIN "public"."mp_aliases" "a" ON (("m"."id" = "a"."mp_id")));

ALTER TABLE "public"."combined_mp_names_view" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debate" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sitting_id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "summary" "text",
    "order_no" bigint NOT NULL
);

ALTER TABLE "public"."debate" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."debate_speech" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "debate_id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "order_no" bigint NOT NULL,
    "speaker_name" "text"
);

ALTER TABLE "public"."debate_speech" OWNER TO "postgres";

COMMENT ON COLUMN "public"."debate_speech"."speaker_name" IS 'The speaker name as detected in the content, without the honorifics. Trimmed. Used to enable dynamic name aliasing.';

CREATE MATERIALIZED VIEW "public"."debate_bill_match_view" AS
 SELECT "d"."id" AS "debate_id",
    "b"."id" AS "bill_id",
    (EXISTS ( SELECT 1
           FROM "public"."debate_speech" "ds"
          WHERE (("ds"."debate_id" = "d"."id") AND (("lower"("ds"."content") ~~ '%order for second reading read%'::"text") OR ("lower"("ds"."content") ~~ '%be now read a second time%'::"text") OR ("lower"("ds"."content") ~~ '%now be read a second time%'::"text"))))) AS "is_second_reading"
   FROM ("public"."debate" "d"
     JOIN "public"."bill" "b" ON (("d"."title" = "b"."name")))
  WITH NO DATA;

ALTER TABLE "public"."debate_bill_match_view" OWNER TO "postgres";

ALTER TABLE "public"."debate" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."debate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."sitting" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sitting_date_id" bigint NOT NULL,
    "parliament_no" bigint NOT NULL,
    "session_no" bigint NOT NULL,
    "volume_no" bigint NOT NULL,
    "sitting_no" bigint NOT NULL,
    "summary" "text"
);

ALTER TABLE "public"."sitting" OWNER TO "postgres";

COMMENT ON TABLE "public"."sitting" IS 'Extra information that can only be scraped from the actual report.';

CREATE TABLE IF NOT EXISTS "public"."sitting_date" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sitting_date" "date" NOT NULL
);

ALTER TABLE "public"."sitting_date" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."debate_sortable_view" WITH ("security_invoker"='on') AS
 SELECT "d"."id",
    "d"."title",
    "d"."order_no",
    "d"."summary",
    "sd"."sitting_date"
   FROM (("public"."debate" "d"
     JOIN "public"."sitting" "s" ON (("d"."sitting_id" = "s"."id")))
     JOIN "public"."sitting_date" "sd" ON (("s"."sitting_date_id" = "sd"."id")));

ALTER TABLE "public"."debate_sortable_view" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."debate_speech_full_text_view" WITH ("security_invoker"='on') AS
 SELECT "ds"."debate_id",
    "d"."title",
    ((((((COALESCE("ds"."speaker_name", ''::"text") || ' '::"text") || "ds"."content") || ' '::"text") || COALESCE("d"."summary", ''::"text")) || ' '::"text") || "d"."title") AS "full_text"
   FROM ("public"."debate_speech" "ds"
     JOIN "public"."debate" "d" ON (("ds"."debate_id" = "d"."id")));

ALTER TABLE "public"."debate_speech_full_text_view" OWNER TO "postgres";

ALTER TABLE "public"."debate_speech" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."debate_speech_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."mp_aliases" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mp_aliases_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."mp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."mp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."party" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "colour" "text" NOT NULL,
    "photo_url" "text",
    "wikidata_id" "text" NOT NULL
);

ALTER TABLE "public"."party" OWNER TO "postgres";

ALTER TABLE "public"."party" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."party_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."sitting_date" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sitting_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."sitting" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."sitting_info_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE OR REPLACE VIEW "public"."unscraped_sitting_dates_view" WITH ("security_invoker"='on') AS
 SELECT "sd"."id",
    "sd"."created_at",
    "sd"."sitting_date"
   FROM ("public"."sitting_date" "sd"
     LEFT JOIN "public"."sitting" "s" ON (("sd"."id" = "s"."sitting_date_id")))
  WHERE ("s"."sitting_date_id" IS NULL);

ALTER TABLE "public"."unscraped_sitting_dates_view" OWNER TO "postgres";

ALTER TABLE ONLY "public"."bill"
    ADD CONSTRAINT "Bills_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."bill"
    ADD CONSTRAINT "bill_bill_no_key" UNIQUE ("bill_no");

ALTER TABLE ONLY "public"."debate"
    ADD CONSTRAINT "debate_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."debate_speech"
    ADD CONSTRAINT "debate_speech_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."mp_aliases"
    ADD CONSTRAINT "mp_aliases_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."mp"
    ADD CONSTRAINT "mp_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."mp"
    ADD CONSTRAINT "mp_wikidata_id_key" UNIQUE ("wikidata_id");

ALTER TABLE ONLY "public"."party"
    ADD CONSTRAINT "party_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."party"
    ADD CONSTRAINT "party_wikidata_id_key" UNIQUE ("wikidata_id");

ALTER TABLE ONLY "public"."sitting"
    ADD CONSTRAINT "sitting_info_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sitting"
    ADD CONSTRAINT "sitting_info_sitting_id_key" UNIQUE ("sitting_date_id");

ALTER TABLE ONLY "public"."sitting_date"
    ADD CONSTRAINT "sitting_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sitting_date"
    ADD CONSTRAINT "sitting_sitting_date_key" UNIQUE ("sitting_date");

ALTER TABLE ONLY "public"."debate"
    ADD CONSTRAINT "debate_sitting_id_fkey" FOREIGN KEY ("sitting_id") REFERENCES "public"."sitting"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."debate_speech"
    ADD CONSTRAINT "debate_speech_debate_id_fkey" FOREIGN KEY ("debate_id") REFERENCES "public"."debate"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."mp_aliases"
    ADD CONSTRAINT "mp_aliases_mp_id_fkey" FOREIGN KEY ("mp_id") REFERENCES "public"."mp"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."mp"
    ADD CONSTRAINT "mp_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."sitting"
    ADD CONSTRAINT "sitting_info_sitting_id_fkey" FOREIGN KEY ("sitting_date_id") REFERENCES "public"."sitting_date"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable read access for all users" ON "public"."bill" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."debate" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."debate_speech" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."mp" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."mp_aliases" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."party" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."sitting" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."sitting_date" FOR SELECT USING (true);

ALTER TABLE "public"."bill" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debate" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."debate_speech" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."mp" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."mp_aliases" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."party" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sitting" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sitting_date" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

REVOKE ALL ON FUNCTION "public"."refresh_materialized_view"("view_name" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."refresh_materialized_view"("view_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_materialized_view"("view_name" "text") TO "service_role";

GRANT ALL ON TABLE "public"."bill" TO "anon";
GRANT ALL ON TABLE "public"."bill" TO "authenticated";
GRANT ALL ON TABLE "public"."bill" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Bills_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Bills_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Bills_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."bill_full_text_view" TO "anon";
GRANT ALL ON TABLE "public"."bill_full_text_view" TO "authenticated";
GRANT ALL ON TABLE "public"."bill_full_text_view" TO "service_role";

GRANT ALL ON TABLE "public"."mp" TO "anon";
GRANT ALL ON TABLE "public"."mp" TO "authenticated";
GRANT ALL ON TABLE "public"."mp" TO "service_role";

GRANT ALL ON TABLE "public"."mp_aliases" TO "anon";
GRANT ALL ON TABLE "public"."mp_aliases" TO "authenticated";
GRANT ALL ON TABLE "public"."mp_aliases" TO "service_role";

GRANT ALL ON TABLE "public"."combined_mp_names_view" TO "anon";
GRANT ALL ON TABLE "public"."combined_mp_names_view" TO "authenticated";
GRANT ALL ON TABLE "public"."combined_mp_names_view" TO "service_role";

GRANT ALL ON TABLE "public"."debate" TO "anon";
GRANT ALL ON TABLE "public"."debate" TO "authenticated";
GRANT ALL ON TABLE "public"."debate" TO "service_role";

GRANT ALL ON TABLE "public"."debate_speech" TO "anon";
GRANT ALL ON TABLE "public"."debate_speech" TO "authenticated";
GRANT ALL ON TABLE "public"."debate_speech" TO "service_role";

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."debate_bill_match_view" TO "anon";
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."debate_bill_match_view" TO "authenticated";
GRANT ALL ON TABLE "public"."debate_bill_match_view" TO "service_role";

GRANT ALL ON SEQUENCE "public"."debate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."debate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."debate_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."sitting" TO "anon";
GRANT ALL ON TABLE "public"."sitting" TO "authenticated";
GRANT ALL ON TABLE "public"."sitting" TO "service_role";

GRANT ALL ON TABLE "public"."sitting_date" TO "anon";
GRANT ALL ON TABLE "public"."sitting_date" TO "authenticated";
GRANT ALL ON TABLE "public"."sitting_date" TO "service_role";

GRANT ALL ON TABLE "public"."debate_sortable_view" TO "anon";
GRANT ALL ON TABLE "public"."debate_sortable_view" TO "authenticated";
GRANT ALL ON TABLE "public"."debate_sortable_view" TO "service_role";

GRANT ALL ON TABLE "public"."debate_speech_full_text_view" TO "anon";
GRANT ALL ON TABLE "public"."debate_speech_full_text_view" TO "authenticated";
GRANT ALL ON TABLE "public"."debate_speech_full_text_view" TO "service_role";

GRANT ALL ON SEQUENCE "public"."debate_speech_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."debate_speech_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."debate_speech_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."mp_aliases_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mp_aliases_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mp_aliases_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."mp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."mp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."mp_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."party" TO "anon";
GRANT ALL ON TABLE "public"."party" TO "authenticated";
GRANT ALL ON TABLE "public"."party" TO "service_role";

GRANT ALL ON SEQUENCE "public"."party_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."party_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."party_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."sitting_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sitting_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sitting_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."sitting_info_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sitting_info_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sitting_info_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."unscraped_sitting_dates_view" TO "anon";
GRANT ALL ON TABLE "public"."unscraped_sitting_dates_view" TO "authenticated";
GRANT ALL ON TABLE "public"."unscraped_sitting_dates_view" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
