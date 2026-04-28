


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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid" DEFAULT NULL::"uuid") RETURNS "jsonb"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  with base as (
    select
      feature,
      model,
      status,
      coalesce(input_tokens, 0)::bigint as input_tokens,
      coalesce(output_tokens, 0)::bigint as output_tokens,
      coalesce(total_tokens, 0)::bigint as total_tokens
    from public.openai_usage_events
    where created_at >= since_ts
      and (filter_user_id is null or user_id = filter_user_id)
  ),
  priced as (
    select
      *,
      case lower(model)
        when 'gpt-5.4' then 2.5
        when 'gpt-5.4-mini' then 0.75
        when 'gpt-5.4-nano' then 0.2
        when 'gpt-5.2' then 1.75
        when 'gpt-5.1' then 1.25
        when 'gpt-5' then 1.25
        when 'gpt-5-mini' then 0.25
        when 'gpt-5-nano' then 0.05
        when 'gpt-4.1' then 2
        when 'gpt-4.1-mini' then 0.4
        when 'gpt-4.1-nano' then 0.1
        when 'gpt-4o' then 2.5
        when 'gpt-4o-mini' then 0.15
        when 'o3' then 2
        when 'o4-mini' then 1.1
        else null
      end::numeric as input_rate_per_million,
      case lower(model)
        when 'gpt-5.4' then 15
        when 'gpt-5.4-mini' then 4.5
        when 'gpt-5.4-nano' then 1.25
        when 'gpt-5.2' then 14
        when 'gpt-5.1' then 10
        when 'gpt-5' then 10
        when 'gpt-5-mini' then 2
        when 'gpt-5-nano' then 0.4
        when 'gpt-4.1' then 8
        when 'gpt-4.1-mini' then 1.6
        when 'gpt-4.1-nano' then 0.4
        when 'gpt-4o' then 10
        when 'gpt-4o-mini' then 0.6
        when 'o3' then 8
        when 'o4-mini' then 4.4
        else null
      end::numeric as output_rate_per_million
    from base
  ),
  totals as (
    select
      count(*)::bigint as event_count,
      count(*) filter (where status = 'error')::bigint as error_count,
      coalesce(sum(input_tokens), 0)::bigint as input_tokens,
      coalesce(sum(output_tokens), 0)::bigint as output_tokens,
      coalesce(sum(total_tokens), 0)::bigint as total_tokens,
      coalesce(
        sum(
          case
            when input_rate_per_million is not null and output_rate_per_million is not null
              then (input_tokens * input_rate_per_million + output_tokens * output_rate_per_million) / 1000000.0
            else 0
          end
        ),
        0
      )::numeric as estimated_cost_usd,
      count(*) filter (
        where input_rate_per_million is null or output_rate_per_million is null
      )::bigint as unknown_pricing_events
    from priced
  )
  select jsonb_build_object(
    'totals', (
      select jsonb_build_object(
        'event_count', event_count,
        'error_count', error_count,
        'input_tokens', input_tokens,
        'output_tokens', output_tokens,
        'total_tokens', total_tokens,
        'estimated_cost_usd', round(estimated_cost_usd, 6),
        'unknown_pricing_events', unknown_pricing_events
      )
      from totals
    ),
    'by_feature', (
      select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb)
      from (
        select
          feature,
          count(*)::bigint as events,
          coalesce(sum(input_tokens), 0)::bigint as input,
          coalesce(sum(output_tokens), 0)::bigint as output,
          coalesce(sum(total_tokens), 0)::bigint as total,
          round(
            coalesce(
              sum(
                case
                  when input_rate_per_million is not null and output_rate_per_million is not null
                    then (input_tokens * input_rate_per_million + output_tokens * output_rate_per_million) / 1000000.0
                  else 0
                end
              ),
              0
            )::numeric,
            6
          ) as estimated_cost_usd,
          count(*) filter (
            where input_rate_per_million is null or output_rate_per_million is null
          )::bigint as unknown_pricing_events
        from priced
        group by feature
        order by events desc
      ) t
    )
  );
$$;


ALTER FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."beta_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "access_code_hash" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "expires_at" timestamp with time zone,
    "max_uses" integer,
    "uses_count" integer DEFAULT 0 NOT NULL,
    "redeemed_at" timestamp with time zone,
    "granted_by" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."beta_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."brands" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "website" "text",
    "business_description" "text",
    "product_or_service" "text",
    "business_type" "text",
    "assumed_audience" "text"[],
    "marketing_channels" "text"[],
    "country" "text",
    "region_or_city" "text",
    "currency" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "color" "text"
);


ALTER TABLE "public"."brands" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collection_items" (
    "collection_id" "uuid" NOT NULL,
    "icp_id" "uuid" NOT NULL
);


ALTER TABLE "public"."collection_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "description" "text",
    "color" "text" DEFAULT '#BBA0E5'::"text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "tags" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."collections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."guest_checkouts" (
    "guest_ref" "text" NOT NULL,
    "email" "text",
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "price_id" "text",
    "status" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "session_id" "text",
    "linked_user_id" "uuid"
);


ALTER TABLE "public"."guest_checkouts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."icp_meta_activation_packs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "icp_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "strategy_id" "uuid",
    "pack_name" "text" NOT NULL,
    "goal" "text",
    "pack_json" "jsonb" NOT NULL,
    "prompt_version" "text" NOT NULL,
    "model" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."icp_meta_activation_packs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."icp_social_content_packs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "icp_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "strategy_id" "uuid",
    "pack_name" "text" NOT NULL,
    "goal" "text",
    "channel_mix" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "pack_json" "jsonb" NOT NULL,
    "visuals_generated_count" integer DEFAULT 0 NOT NULL,
    "prompt_version" "text" NOT NULL,
    "plan_model" "text" NOT NULL,
    "visual_model" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."icp_social_content_packs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."icp_strategies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "icp_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "goal" "text" NOT NULL,
    "channel" "text",
    "offer_type" "text",
    "tone" "text",
    "strategy" "jsonb" NOT NULL,
    "prompt_version" "text" NOT NULL,
    "model" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "strategy_name" "text"
);


ALTER TABLE "public"."icp_strategies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."icps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "industry" "text",
    "company_size" "text",
    "location" "text",
    "pain_points" "text"[],
    "goals" "text"[],
    "budget" "text",
    "decision_makers" "text"[],
    "tech_stack" "text"[],
    "challenges" "text"[],
    "opportunities" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "collection_id" "uuid",
    "circle_color" "text",
    "color" "text",
    "age_range" "text",
    "avatar_key" "text",
    "gender" "text",
    "brand_id" "uuid"
);


ALTER TABLE "public"."icps" OWNER TO "postgres";




CREATE TABLE IF NOT EXISTS "public"."openai_usage_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "feature" "text" NOT NULL,
    "model" "text" NOT NULL,
    "status" "text" DEFAULT 'success'::"text" NOT NULL,
    "icp_id" "uuid",
    "related_id" "uuid",
    "response_id" "text",
    "input_tokens" integer,
    "output_tokens" integer,
    "total_tokens" integer,
    "reasoning_tokens" integer,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."openai_usage_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "name" "text",
    "subscription_tier" "text" DEFAULT 'free'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "icp_limit" integer DEFAULT 3 NOT NULL,
    "collection_limit" integer DEFAULT 1 NOT NULL,
    "trial_started_at" timestamp with time zone,
    "trial_ends_at" timestamp with time zone,
    "trial_converted_at" timestamp with time zone,
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "contact_number" "text",
    CONSTRAINT "profiles_trial_dates_valid" CHECK ((("trial_started_at" IS NULL) OR ("trial_ends_at" IS NULL) OR ("trial_ends_at" > "trial_started_at")))
);

ALTER TABLE ONLY "public"."profiles" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stripe_customers" (
    "user_id" "uuid" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."stripe_customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stripe_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_subscription_id" "text" NOT NULL,
    "stripe_customer_id" "text" NOT NULL,
    "price_id" "text",
    "status" "text",
    "cancel_at_period_end" boolean DEFAULT false NOT NULL,
    "current_period_end" timestamp with time zone,
    "trial_start" timestamp with time zone,
    "trial_end" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."stripe_subscriptions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."beta_invites"
    ADD CONSTRAINT "beta_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collection_items"
    ADD CONSTRAINT "collection_items_pkey" PRIMARY KEY ("collection_id", "icp_id");



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."guest_checkouts"
    ADD CONSTRAINT "guest_checkouts_pkey" PRIMARY KEY ("guest_ref");



ALTER TABLE ONLY "public"."guest_checkouts"
    ADD CONSTRAINT "guest_checkouts_session_id_unique" UNIQUE ("session_id");



ALTER TABLE ONLY "public"."icp_meta_activation_packs"
    ADD CONSTRAINT "icp_meta_activation_packs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."icp_social_content_packs"
    ADD CONSTRAINT "icp_social_content_packs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."icp_strategies"
    ADD CONSTRAINT "icp_strategies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."icps"
    ADD CONSTRAINT "icps_pkey" PRIMARY KEY ("id");






ALTER TABLE ONLY "public"."openai_usage_events"
    ADD CONSTRAINT "openai_usage_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_stripe_customer_id_key" UNIQUE ("stripe_customer_id");



ALTER TABLE ONLY "public"."stripe_subscriptions"
    ADD CONSTRAINT "stripe_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stripe_subscriptions"
    ADD CONSTRAINT "stripe_subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



CREATE UNIQUE INDEX "beta_invites_email_hash_unique" ON "public"."beta_invites" USING "btree" ("lower"("email"), "access_code_hash");



CREATE INDEX "beta_invites_email_idx" ON "public"."beta_invites" USING "btree" ("lower"("email"));



CREATE INDEX "brands_user_id_idx" ON "public"."brands" USING "btree" ("user_id");



CREATE UNIQUE INDEX "brands_user_id_name_uniq" ON "public"."brands" USING "btree" ("user_id", "name");



CREATE INDEX "guest_checkouts_linked_user_id_idx" ON "public"."guest_checkouts" USING "btree" ("linked_user_id");



CREATE INDEX "guest_checkouts_session_id_idx" ON "public"."guest_checkouts" USING "btree" ("session_id");



CREATE INDEX "icp_meta_activation_packs_icp_created_idx" ON "public"."icp_meta_activation_packs" USING "btree" ("icp_id", "created_at" DESC);



CREATE INDEX "icp_meta_activation_packs_user_created_idx" ON "public"."icp_meta_activation_packs" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "icp_strategies_icp_id_created_idx" ON "public"."icp_strategies" USING "btree" ("icp_id", "created_at" DESC);



CREATE INDEX "icps_brand_id_idx" ON "public"."icps" USING "btree" ("brand_id");



CREATE INDEX "idx_collection_items_collection_id" ON "public"."collection_items" USING "btree" ("collection_id");



CREATE INDEX "idx_collections_user_id" ON "public"."collections" USING "btree" ("user_id");



CREATE INDEX "idx_icp_social_content_packs_icp_created" ON "public"."icp_social_content_packs" USING "btree" ("icp_id", "created_at" DESC);



CREATE INDEX "idx_icp_social_content_packs_user_created" ON "public"."icp_social_content_packs" USING "btree" ("user_id", "created_at" DESC);















CREATE INDEX "openai_usage_events_feature_created_idx" ON "public"."openai_usage_events" USING "btree" ("feature", "created_at" DESC);



CREATE INDEX "openai_usage_events_user_created_idx" ON "public"."openai_usage_events" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "profiles_trial_ends_at_idx" ON "public"."profiles" USING "btree" ("trial_ends_at");



CREATE INDEX "stripe_subscriptions_user_id_idx" ON "public"."stripe_subscriptions" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."icps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collection_items"
    ADD CONSTRAINT "collection_items_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collections"
    ADD CONSTRAINT "collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."guest_checkouts"
    ADD CONSTRAINT "guest_checkouts_linked_user_id_fkey" FOREIGN KEY ("linked_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."icp_meta_activation_packs"
    ADD CONSTRAINT "icp_meta_activation_packs_icp_id_fkey" FOREIGN KEY ("icp_id") REFERENCES "public"."icps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icp_meta_activation_packs"
    ADD CONSTRAINT "icp_meta_activation_packs_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."icp_strategies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."icp_meta_activation_packs"
    ADD CONSTRAINT "icp_meta_activation_packs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icp_social_content_packs"
    ADD CONSTRAINT "icp_social_content_packs_icp_id_fkey" FOREIGN KEY ("icp_id") REFERENCES "public"."icps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icp_social_content_packs"
    ADD CONSTRAINT "icp_social_content_packs_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."icp_strategies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."icp_social_content_packs"
    ADD CONSTRAINT "icp_social_content_packs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icp_strategies"
    ADD CONSTRAINT "icp_strategies_icp_id_fkey" FOREIGN KEY ("icp_id") REFERENCES "public"."icps"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icp_strategies"
    ADD CONSTRAINT "icp_strategies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."icps"
    ADD CONSTRAINT "icps_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."icps"
    ADD CONSTRAINT "icps_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id");



ALTER TABLE ONLY "public"."icps"
    ADD CONSTRAINT "icps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;






ALTER TABLE ONLY "public"."openai_usage_events"
    ADD CONSTRAINT "openai_usage_events_icp_id_fkey" FOREIGN KEY ("icp_id") REFERENCES "public"."icps"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."openai_usage_events"
    ADD CONSTRAINT "openai_usage_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stripe_customers"
    ADD CONSTRAINT "stripe_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stripe_subscriptions"
    ADD CONSTRAINT "stripe_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;






CREATE POLICY "Users can delete collection items" ON "public"."collection_items" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_items"."collection_id") AND ("collections"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete own social content packs" ON "public"."icp_social_content_packs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own stripe_customer" ON "public"."stripe_customers" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their collections" ON "public"."collections" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own ICPs" ON "public"."icps" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own brands" ON "public"."brands" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own collections" ON "public"."collections" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert collection items" ON "public"."collection_items" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_items"."collection_id") AND ("collections"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert collections" ON "public"."collections" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own social content packs" ON "public"."icp_social_content_packs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own stripe_customer" ON "public"."stripe_customers" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own ICPs" ON "public"."icps" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (("brand_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."brands" "b"
  WHERE (("b"."id" = "icps"."brand_id") AND ("b"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can insert their own brands" ON "public"."brands" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own collections" ON "public"."collections" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can select own social content packs" ON "public"."icp_social_content_packs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own social content packs" ON "public"."icp_social_content_packs" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own stripe_customer" ON "public"."stripe_customers" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their collections" ON "public"."collections" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own ICPs" ON "public"."icps" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK ((("auth"."uid"() = "user_id") AND (("brand_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."brands" "b"
  WHERE (("b"."id" = "icps"."brand_id") AND ("b"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can update their own brands" ON "public"."brands" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own collections" ON "public"."collections" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own stripe_customer" ON "public"."stripe_customers" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own stripe_subscription" ON "public"."stripe_subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their collection items" ON "public"."collection_items" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."collections"
  WHERE (("collections"."id" = "collection_items"."collection_id") AND ("collections"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their collections" ON "public"."collections" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own ICPs" ON "public"."icps" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own brands" ON "public"."brands" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own collections" ON "public"."collections" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage their own collection items" ON "public"."collection_items" USING (("auth"."uid"() = ( SELECT "collections"."user_id"
   FROM "public"."collections"
  WHERE ("collections"."id" = "collection_items"."collection_id"))));



ALTER TABLE "public"."beta_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."brands" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collection_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."guest_checkouts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."icp_meta_activation_packs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "icp_meta_activation_packs_delete_own" ON "public"."icp_meta_activation_packs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_meta_activation_packs_insert_own" ON "public"."icp_meta_activation_packs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_meta_activation_packs_select_own" ON "public"."icp_meta_activation_packs" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_meta_activation_packs_update_own" ON "public"."icp_meta_activation_packs" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."icp_social_content_packs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."icp_strategies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "icp_strategies_delete_own" ON "public"."icp_strategies" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_strategies_insert_own" ON "public"."icp_strategies" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_strategies_select_own" ON "public"."icp_strategies" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "icp_strategies_update_own" ON "public"."icp_strategies" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."icps" ENABLE ROW LEVEL SECURITY;




ALTER TABLE "public"."openai_usage_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "openai_usage_events_insert_own" ON "public"."openai_usage_events" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "openai_usage_events_select_own" ON "public"."openai_usage_events" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_insert" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_select" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_update" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."stripe_customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stripe_subscriptions" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_openai_usage_aggregate"("since_ts" timestamp with time zone, "filter_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."beta_invites" TO "anon";
GRANT ALL ON TABLE "public"."beta_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."beta_invites" TO "service_role";



GRANT ALL ON TABLE "public"."brands" TO "anon";
GRANT ALL ON TABLE "public"."brands" TO "authenticated";
GRANT ALL ON TABLE "public"."brands" TO "service_role";



GRANT ALL ON TABLE "public"."collection_items" TO "anon";
GRANT ALL ON TABLE "public"."collection_items" TO "authenticated";
GRANT ALL ON TABLE "public"."collection_items" TO "service_role";



GRANT ALL ON TABLE "public"."collections" TO "anon";
GRANT ALL ON TABLE "public"."collections" TO "authenticated";
GRANT ALL ON TABLE "public"."collections" TO "service_role";



GRANT ALL ON TABLE "public"."guest_checkouts" TO "anon";
GRANT ALL ON TABLE "public"."guest_checkouts" TO "authenticated";
GRANT ALL ON TABLE "public"."guest_checkouts" TO "service_role";



GRANT ALL ON TABLE "public"."icp_meta_activation_packs" TO "anon";
GRANT ALL ON TABLE "public"."icp_meta_activation_packs" TO "authenticated";
GRANT ALL ON TABLE "public"."icp_meta_activation_packs" TO "service_role";



GRANT ALL ON TABLE "public"."icp_social_content_packs" TO "anon";
GRANT ALL ON TABLE "public"."icp_social_content_packs" TO "authenticated";
GRANT ALL ON TABLE "public"."icp_social_content_packs" TO "service_role";



GRANT ALL ON TABLE "public"."icp_strategies" TO "anon";
GRANT ALL ON TABLE "public"."icp_strategies" TO "authenticated";
GRANT ALL ON TABLE "public"."icp_strategies" TO "service_role";



GRANT ALL ON TABLE "public"."icps" TO "anon";
GRANT ALL ON TABLE "public"."icps" TO "authenticated";
GRANT ALL ON TABLE "public"."icps" TO "service_role";






GRANT ALL ON TABLE "public"."openai_usage_events" TO "anon";
GRANT ALL ON TABLE "public"."openai_usage_events" TO "authenticated";
GRANT ALL ON TABLE "public"."openai_usage_events" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT SELECT("id"),INSERT("id") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("email"),INSERT("email"),UPDATE("email") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("name"),INSERT("name"),UPDATE("name") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("subscription_tier"),INSERT("subscription_tier") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT("created_at") ON TABLE "public"."profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."stripe_customers" TO "anon";
GRANT ALL ON TABLE "public"."stripe_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_customers" TO "service_role";



GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







