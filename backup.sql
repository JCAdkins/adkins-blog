--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: jordy
--

CREATE TYPE public."NotificationType" AS ENUM (
    'LIKE',
    'REPLY'
);


ALTER TYPE public."NotificationType" OWNER TO jordy;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: jordy
--

CREATE TYPE public."Role" AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public."Role" OWNER TO jordy;

--
-- Name: mark_message_as_read(text); Type: FUNCTION; Schema: public; Owner: jordy
--

CREATE FUNCTION public.mark_message_as_read(msg_id text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE "ContactMessage"
  SET read = true
  WHERE id = msg_id;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;

  RETURN updated_rows > 0;
END;
$$;


ALTER FUNCTION public.mark_message_as_read(msg_id text) OWNER TO jordy;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    featured text DEFAULT 'false'::text NOT NULL,
    description text DEFAULT 'No description provided.'::text NOT NULL,
    genre text
);


ALTER TABLE public."BlogPost" OWNER TO jordy;

--
-- Name: BlogPostImage; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."BlogPostImage" (
    "blogPostId" text NOT NULL,
    "imageId" text NOT NULL
);


ALTER TABLE public."BlogPostImage" OWNER TO jordy;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "postId" text NOT NULL,
    "authorId" text NOT NULL,
    "parentId" text,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Comment" OWNER TO jordy;

--
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."ContactMessage" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read boolean DEFAULT false NOT NULL,
    subject text NOT NULL
);


ALTER TABLE public."ContactMessage" OWNER TO jordy;

--
-- Name: Image; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."Image" (
    id text NOT NULL,
    status text NOT NULL
);


ALTER TABLE public."Image" OWNER TO jordy;

--
-- Name: Like; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."Like" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "commentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO jordy;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    type public."NotificationType" NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "commentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actorId" text NOT NULL,
    "replyId" text
);


ALTER TABLE public."Notification" OWNER TO jordy;

--
-- Name: User; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    "firstName" text,
    "lastName" text,
    "lastLoginAt" timestamp(3) without time zone,
    "activityVisible" boolean DEFAULT true NOT NULL,
    image text,
    "isVerified" boolean DEFAULT false NOT NULL,
    location text,
    "profileVisibility" text DEFAULT 'users'::text NOT NULL,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO jordy;

--
-- Name: UserSession; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public."UserSession" (
    id text NOT NULL,
    "userId" text NOT NULL,
    device text NOT NULL,
    browser text NOT NULL,
    os text,
    city text,
    region text,
    country text,
    "ipAddress" text,
    "lastActiveAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isCurrent" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserSession" OWNER TO jordy;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: jordy
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO jordy;

--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."BlogPost" (id, title, content, "createdAt", "updatedAt", featured, description, genre) FROM stdin;
97905467-addb-4ec3-a161-95465418fbd6	Excursion to downtown Vancouver	Exploring downtown Vancouver is like stepping into a dynamic blend of nature and modern design. Towering glass buildings mirror the ever-changing sky, while vibrant murals add splashes of color to alleyways and brick walls. The streets hum with the rhythm of city life—bustling crowds, the distant clang of the SkyTrain, and the occasional seagull soaring overhead from the nearby waterfront. As I wandered through the heart of the city, each turn revealed something new: leafy boulevards, charming boutiques, and unexpected pockets of green space nestled between the concrete. Eventually, I stumbled upon a cozy little café tucked just off a busy street, its warm lighting and the rich scent of coffee drawing me in instantly. Inside, the world seemed to slow down. The clinking of mugs, soft music, and quiet chatter created a comforting soundtrack as I sipped a perfectly made cappuccino. From the window, I watched people go about their day—tourists with cameras, locals on bikes, a street musician strumming mellow tunes. It was a perfect pause in the middle of a vibrant city—a moment to breathe, reflect, and simply enjoy the view.	2025-06-01 06:31:44.832	2025-06-01 06:31:44.832	true	The beautiful sights of of downtown Vancouver with a stop at a wonderful cafe.	\N
d2b9df6f-4076-4a35-a847-722455398992	Portland's Japanese Garden Visit	This May, my grandma and I had the chance to explore one of Portland’s most treasured landmarks — the Portland Japanese Garden. Nestled in the lush West Hills within Washington Park, the garden offers a serene escape from the bustle of city life, and it turned out to be one of the most peaceful and visually stunning places we’ve ever visited.\r\n\r\nFrom the moment we stepped through the Welcome Center, we were immersed in a landscape that perfectly blended the natural beauty of the Pacific Northwest with the timeless elegance of traditional Japanese garden design. A gentle, winding path led us uphill, through a forest of Alaskan cedar, Japanese pine, and blooming native plants like trillium and bleeding hearts. Even this short hike set the tone — calm, quiet, and connected to nature.\r\n\r\nAt the top, we arrived at the Cultural Village, a beautiful space that blends Japanese architecture with local materials. From there, we began exploring the garden’s eight distinct styles, each offering a unique perspective on harmony, balance, and design. The use of stones, water, plants, and open space was deliberate and meditative — nothing felt out of place.\r\n\r\nOne of our favorite areas was the Tea Garden, where moss carpets the ground and a narrow stone path guides visitors through the trees. As we slowly walked the path, I couldn’t help but feel a deep sense of calm. According to tradition, this path is meant to help visitors leave behind the concerns of the outside world — and it truly did. At the center of the Tea Garden is the Kashintei Tea House, which was originally constructed in Japan before being carefully relocated to Portland. It has a rustic charm and invites quiet reflection.\r\n\r\nAnother highlight was the Strolling Pond Garden, where koi swam lazily beneath wooden bridges and the sound of water trickling through rocks created a natural melody. We paused often just to listen — there are no plant labels or distracting signs in the garden. Instead, visitors are encouraged to remain silent and simply be present in the moment.\r\n\r\nWe also admired the panoramic views from the Overlook Pavilion — you can see downtown Portland, Mount Hood (on a clear day!), and the surrounding tree canopy all from one peaceful perch. It was a great place to sit and appreciate just how masterfully the garden integrates landscape, culture, and architecture.\r\n\r\nBy the end of our visit, both of us felt restored. The Portland Japanese Garden is more than just a beautiful place — it’s a living, breathing tribute to the deep cultural ties between Oregon and Japan. Whether you’re a local or a visitor, I can’t recommend it enough. It’s a sanctuary for anyone who appreciates nature, design, or just a moment of quiet in a noisy world.	2025-06-01 06:50:44.323	2025-06-01 06:50:44.323	true	Grandma and I visited the notorious Japanese Garden in Portland this May.	\N
1a40962b-664d-4ace-8fa5-71e57dd2e002	This Is A Test Post	I am some test content.	2025-06-19 08:36:17.433	2025-06-19 08:36:17.433	false	I am a test description!	educational
2e215693-c3ec-4119-ace6-249731c83bb3	This Is Test Number Two	This is some test content for test number two.	2025-06-19 09:16:33.974	2025-06-19 09:16:33.974	false	This is test description number two.	review
3f5d507b-2082-4238-9723-b3be36c64dfb	Third test post	content	2025-07-01 10:49:28.353	2025-07-01 10:49:28.353	true	description	tutorial
4e95297b-6613-40be-a15b-166b694cd1bb	Fourth test post	Some ontent.	2025-07-01 10:55:34.886	2025-07-01 10:55:34.886	false	Dsecritpiton	tutorial
ba868cce-483c-49c5-a20f-9b179a96f074	Fourth test post	Some ontent.	2025-07-01 10:59:47.043	2025-07-01 10:59:47.043	false	Dsecritpiton	tutorial
72725b67-78b2-4868-a5d9-44164c52542f	Fourth test post	content	2025-07-01 11:02:46.019	2025-07-01 11:02:46.019	true	description	review
627a9aae-7a7d-46f1-b107-60908145c2b3	This is the beginning	Join us on this wonderful, amazing discovery of something amazing.	2025-07-02 21:14:35.056	2025-07-02 21:14:35.056	false	Of something amazing	news
c46be398-6226-4e43-badb-264951d431af	This is the beginning	Join us on this wonderful, amazing discovery of something amazing.	2025-07-02 21:21:43.887	2025-07-02 21:21:43.887	false	Of something amazing	news
f074fdd0-1a11-4158-8fd7-5f9350371a31	Something new, something blue	oijoijoijoijoijoijoijoijoij	2025-07-02 21:25:34.004	2025-07-02 21:25:34.004	false	oijoijoijojoijoijoij	comparison
dae1c460-614b-4086-9be3-8d23ca867690	This is the beginning	Join us on this wonderful, amazing discovery of something amazing.	2025-07-02 21:18:41.856	2025-07-02 21:18:41.856	true	Of something amazing	news
359731de-efe1-4128-88b6-e146a55b9401	Fifth test post!	I am supposed to write some nice content here.	2025-07-02 20:52:38.959	2025-07-02 20:52:38.959	true	This is some kind of description!	news
\.


--
-- Data for Name: BlogPostImage; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."BlogPostImage" ("blogPostId", "imageId") FROM stdin;
97905467-addb-4ec3-a161-95465418fbd6	3606af9d-04af-43be-8e91-4e080e6ef30f
97905467-addb-4ec3-a161-95465418fbd6	aa659782-a5c0-45bd-be72-c45ba6601332
97905467-addb-4ec3-a161-95465418fbd6	d5b5d9d3-de3f-423a-844e-b336714dc281
97905467-addb-4ec3-a161-95465418fbd6	16ef74b9-63db-49f5-9850-3cf4d1f1f8b9
97905467-addb-4ec3-a161-95465418fbd6	e8e3777f-a89e-44fa-977f-ab7504bbc3ce
d2b9df6f-4076-4a35-a847-722455398992	8079faa9-8116-445f-a018-c297f86343f2
d2b9df6f-4076-4a35-a847-722455398992	3b5a3728-dad9-4563-b3c4-b6d85162eb22
d2b9df6f-4076-4a35-a847-722455398992	61b900d2-fc14-4be6-8f66-6813a8cfcb9f
d2b9df6f-4076-4a35-a847-722455398992	41b4fbd3-08d5-4191-bd40-3efae61f26db
d2b9df6f-4076-4a35-a847-722455398992	e7c2110f-4dab-4528-aea1-5cb7d4a646e6
d2b9df6f-4076-4a35-a847-722455398992	d0ada7cf-a4c3-4372-aa1c-690c2f01f8fb
d2b9df6f-4076-4a35-a847-722455398992	f2199d2a-d259-4424-b4d0-ffc7598f7895
d2b9df6f-4076-4a35-a847-722455398992	f72144ce-3809-4193-b452-20a9c5a7499e
d2b9df6f-4076-4a35-a847-722455398992	a244607c-4934-4164-b6c2-0f74e7b6cf2e
d2b9df6f-4076-4a35-a847-722455398992	e0e2d970-5a58-41be-b79f-9e6b63bffa8a
d2b9df6f-4076-4a35-a847-722455398992	c30a59ba-1ef8-4fb3-8e85-d2d3732e60af
d2b9df6f-4076-4a35-a847-722455398992	697330dc-ab01-4ab4-9c08-9142222300f6
d2b9df6f-4076-4a35-a847-722455398992	3850f535-63e2-4cb1-ae00-31031e93f754
d2b9df6f-4076-4a35-a847-722455398992	1daa1d17-d872-4e72-a2fd-d3da886411ad
d2b9df6f-4076-4a35-a847-722455398992	b926a929-eb0f-4168-984d-dc1ed1f36374
1a40962b-664d-4ace-8fa5-71e57dd2e002	16ef74b9-63db-49f5-9850-3cf4d1f1f8b9
1a40962b-664d-4ace-8fa5-71e57dd2e002	aa659782-a5c0-45bd-be72-c45ba6601332
1a40962b-664d-4ace-8fa5-71e57dd2e002	d5b5d9d3-de3f-423a-844e-b336714dc281
2e215693-c3ec-4119-ace6-249731c83bb3	3606af9d-04af-43be-8e91-4e080e6ef30f
2e215693-c3ec-4119-ace6-249731c83bb3	16ef74b9-63db-49f5-9850-3cf4d1f1f8b9
2e215693-c3ec-4119-ace6-249731c83bb3	e8e3777f-a89e-44fa-977f-ab7504bbc3ce
3f5d507b-2082-4238-9723-b3be36c64dfb	9f18bf0d-25a9-4040-bf60-25955a19ab37
4e95297b-6613-40be-a15b-166b694cd1bb	d5b5d9d3-de3f-423a-844e-b336714dc281
4e95297b-6613-40be-a15b-166b694cd1bb	b0a6d25b-02ee-4ac6-83b1-591d43a1ee88
4e95297b-6613-40be-a15b-166b694cd1bb	aa659782-a5c0-45bd-be72-c45ba6601332
ba868cce-483c-49c5-a20f-9b179a96f074	d5b5d9d3-de3f-423a-844e-b336714dc281
ba868cce-483c-49c5-a20f-9b179a96f074	b0a6d25b-02ee-4ac6-83b1-591d43a1ee88
ba868cce-483c-49c5-a20f-9b179a96f074	aa659782-a5c0-45bd-be72-c45ba6601332
359731de-efe1-4128-88b6-e146a55b9401	e8e3777f-a89e-44fa-977f-ab7504bbc3ce
359731de-efe1-4128-88b6-e146a55b9401	b0a6d25b-02ee-4ac6-83b1-591d43a1ee88
359731de-efe1-4128-88b6-e146a55b9401	aa659782-a5c0-45bd-be72-c45ba6601332
f074fdd0-1a11-4158-8fd7-5f9350371a31	3606af9d-04af-43be-8e91-4e080e6ef30f
f074fdd0-1a11-4158-8fd7-5f9350371a31	b0a6d25b-02ee-4ac6-83b1-591d43a1ee88
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."Comment" (id, content, "createdAt", "updatedAt", "postId", "authorId", "parentId", "isDeleted") FROM stdin;
cmccwboq50000sbhyycdy8oyo	Hello, these pictures are beautiful!	2025-06-26 04:41:25.227	2025-06-26 04:41:25.227	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmccxlgjs0003sbhy4014mijy	Hello hello	2025-06-26 05:17:00.808	2025-06-26 05:17:00.808	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxio3d0002sbhyj8m0o5hg	f
cmccxzrkl0004sbhy966mr5te	Howdy doody	2025-06-26 05:28:08.277	2025-06-26 05:28:08.277	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxio3d0002sbhyj8m0o5hg	f
cmcedcj5k000asb5u2qwrxxgd	Comment #3	2025-06-27 05:25:44.313	2025-06-27 05:25:44.313	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcmfu000bsb5ukhvwcy7m	Comment #4	2025-06-27 05:25:48.571	2025-06-27 05:25:48.571	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcpdp000csb5uf74y88a3	Comment #5	2025-06-27 05:25:52.381	2025-06-27 05:25:52.381	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcs38000dsb5uxvo50drd	Comment #6	2025-06-27 05:25:55.893	2025-06-27 05:25:55.893	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcuux000esb5uyfmwopf6	Comment #7	2025-06-27 05:25:59.482	2025-06-27 05:25:59.482	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcxry000fsb5uqozt4y99	Comment #8	2025-06-27 05:26:03.262	2025-06-27 05:26:03.262	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedd0j1000gsb5uzd1hvjzy	Comment #9	2025-06-27 05:26:06.829	2025-06-27 05:26:06.829	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedd3cq000hsb5uy9jisqd5	Comment #10	2025-06-27 05:26:10.49	2025-06-27 05:26:10.49	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcen7tz30004sbeftvhhe5ko	woot	2025-06-27 10:02:01.215	2025-06-27 10:02:01.215	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedcmfu000bsb5ukhvwcy7m	f
cmcgsjow50000sby5jqk1ex2e	Hello	2025-06-28 22:06:44.933	2025-06-28 22:06:44.933	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmce76hbn0000sbzg614ps9oj	f
cmcgsjzv40001sby5l7f9x8ub	hello	2025-06-28 22:06:59.152	2025-06-28 22:06:59.152	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedcuux000esb5uyfmwopf6	f
cmcgslv6j0002sby5awasq5yh	Heyo	2025-06-28 22:08:26.395	2025-06-28 22:08:26.395	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd3cq000hsb5uy9jisqd5	f
cmchamnuz0008sbkgq1j2z9qo	I agree, howdy doody.	2025-06-29 06:32:56.651	2025-06-29 06:32:56.651	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxzrkl0004sbhy966mr5te	f
cmchawtb80000sb6p2qb3vxll	I agree again, howdy doody.	2025-06-29 06:40:50.276	2025-06-29 06:40:50.276	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxzrkl0004sbhy966mr5te	f
cmchiop060000sbirvvte2aqj	nice	2025-06-29 10:18:28.372	2025-06-29 10:18:28.372	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmced695p0003sb5uso5o4209	f
cmccxio3d0002sbhyj8m0o5hg	Hello hello	2025-06-26 05:14:50.617	2025-06-26 07:17:57.595	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	t
cmcd1y5al0000sb80301zwk6x	Thank you so much :)	2025-06-26 07:18:51.213	2025-06-26 07:18:51.213	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccwboq50000sbhyycdy8oyo	f
cmce76hbn0000sbzg614ps9oj	Tester part 2!	2025-06-27 02:33:04.305	2025-06-27 02:33:04.305	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxlgjs0003sbhy4014mijy	f
cmced1s370000sb5upp2i5hug	Yippee aye ayyy!!	2025-06-27 05:17:22.672	2025-06-27 05:17:22.672	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmce76hbn0000sbzg614ps9oj	f
cmced2mz40001sb5upkg9gl70	Good for you :)	2025-06-27 05:18:02.704	2025-06-27 05:18:02.704	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmce76hbn0000sbzg614ps9oj	f
cmced39r50002sb5uy3vs771k	wwooopp	2025-06-27 05:18:32.225	2025-06-27 05:18:32.225	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmced2mz40001sb5upkg9gl70	f
cmced695p0003sb5uso5o4209	reply #1	2025-06-27 05:20:51.421	2025-06-27 05:20:51.421	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxio3d0002sbhyj8m0o5hg	f
cmced6fys0004sb5udcg3un8r	reply #2	2025-06-27 05:21:00.244	2025-06-27 05:21:00.244	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxio3d0002sbhyj8m0o5hg	f
cmced6l3k0005sb5uheovjtro	reply #3	2025-06-27 05:21:06.896	2025-06-27 05:21:06.896	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxio3d0002sbhyj8m0o5hg	f
cmced6plz0006sb5u1djpkay0	reply #4	2025-06-27 05:21:12.743	2025-06-27 05:21:12.743	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxio3d0002sbhyj8m0o5hg	f
cmcedajri0007sb5ufqwc1iel	reply #5	2025-06-27 05:24:11.791	2025-06-27 05:24:11.791	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxio3d0002sbhyj8m0o5hg	f
cmcedc9zp0008sb5u0eb066hd	Comment #1	2025-06-27 05:25:32.437	2025-06-27 05:25:32.437	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcedcg8z0009sb5uwov6n047	Comment #2	2025-06-27 05:25:40.547	2025-06-27 05:25:40.547	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmchiqv460001sbir7c8a8ar0	very well	2025-06-29 10:20:09.598	2025-06-29 10:20:09.598	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmced695p0003sb5uso5o4209	f
cmchisc7o0004sbirbvm66buw	hi	2025-06-29 10:21:18.419	2025-06-29 10:21:18.419	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd3cq000hsb5uy9jisqd5	f
cmchix8z40007sbir7a1ec04p	Hi 2.0	2025-06-29 10:25:07.504	2025-06-29 10:25:07.504	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd3cq000hsb5uy9jisqd5	f
cmchj124i000asbirhsu3jv4v	test	2025-06-29 10:28:05.25	2025-06-29 10:28:05.25	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxzrkl0004sbhy966mr5te	f
cmchj30dg000bsbir7infg18t	qwertyuiop	2025-06-29 10:29:36.292	2025-06-29 10:29:36.292	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxlgjs0003sbhy4014mijy	f
cmchj4k0g000csbirkabctu62	Hello	2025-06-29 10:30:48.4	2025-06-29 10:30:48.4	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N	f
cmchj4omz000dsbirexnm2koc	Test 1	2025-06-29 10:30:54.395	2025-06-29 10:30:54.395	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmchj4k0g000csbirkabctu62	f
cmchj5dt2000esbir685sptlr	Test 2	2025-06-29 10:31:27.015	2025-06-29 10:31:27.015	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmchj4k0g000csbirkabctu62	f
cmchj7our000hsbirw39ds3zn	Test 3.0	2025-06-29 10:33:14.635	2025-06-29 10:33:14.635	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmchj4k0g000csbirkabctu62	f
cmchj870u000ksbiru9t903q0	Test 4.0	2025-06-29 10:33:38.189	2025-06-29 10:33:38.189	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmchj7our000hsbirw39ds3zn	f
cmchj998f000lsbirzvx9hgoq	Testing	2025-06-29 10:34:27.711	2025-06-29 10:34:27.711	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmchj4k0g000csbirkabctu62	f
cmchkjmld0010sbir28mw6pu6	yup	2025-06-29 11:10:31.201	2025-06-29 11:10:31.201	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmced39r50002sb5uy3vs771k	f
cmkvwcyd3000hwg9pmv6tzgiu	Ok	2026-01-27 01:07:40.408	2026-01-27 01:07:40.408	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcqqx3lk0003sb8nn3bfigse	f
cmkvwd5fw000kwg9p0ia491tv	mhm	2026-01-27 01:07:49.581	2026-01-27 01:07:49.581	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvwcyd3000hwg9pmv6tzgiu	f
cmcmje8x70007sb36k5zmg7ms	comment	2025-07-02 22:37:11.467	2025-07-02 22:37:11.467	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcmky3eu000dsb361lfdobxx	Thanks :)	2025-07-02 23:20:37.063	2025-07-02 23:20:37.063	3f5d507b-2082-4238-9723-b3be36c64dfb	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcmje8x70007sb36k5zmg7ms	f
cmcondji90000sb5l9zxkmbbb	Alo	2025-07-04 10:04:09.344	2025-07-04 10:04:09.344	f074fdd0-1a11-4158-8fd7-5f9350371a31	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcoqduzl0001sb5lksn53831	1	2025-07-04 11:28:23.073	2025-07-04 11:28:23.073	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	f
cmcoqedur0008sb5lq0ocekhq	2	2025-07-04 11:28:47.523	2025-07-04 11:28:47.523	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	f
cmcoqf3ky000bsb5lqqfwq30z	3	2025-07-04 11:29:20.866	2025-07-04 11:29:20.866	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	f
cmcoqfhx1000esb5lx3z1tofk	4	2025-07-04 11:29:39.445	2025-07-04 11:29:39.445	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	f
cmcoqfm93000hsb5l08r7v4y0	5	2025-07-04 11:29:45.063	2025-07-04 11:29:45.063	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	f
cmcpcxmra000ksb5l5g8w15qh	Yes, they are.	2025-07-04 21:59:37.078	2025-07-04 21:59:37.078	d2b9df6f-4076-4a35-a847-722455398992	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccwboq50000sbhyycdy8oyo	f
cmcq1d88h0000sbovthu2s9by	New Comment	2025-07-05 09:23:35.535	2025-07-05 09:23:35.535	f074fdd0-1a11-4158-8fd7-5f9350371a31	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcondji90000sb5l9zxkmbbb	f
cmcq2kzzx0000sbj6o7imnx4v	Welcome! 🤗 	2025-07-05 09:57:37.726	2025-07-05 09:57:37.726	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmky3eu000dsb361lfdobxx	f
cmcq2p6zx0003sbj6c4b9n2bt	Anytime my duder	2025-07-05 10:00:53.421	2025-07-05 10:00:53.421	3f5d507b-2082-4238-9723-b3be36c64dfb	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq2kzzx0000sbj6o7imnx4v	f
cmcq3y5ej0000sbgl69p0kcou	Some other comment	2025-07-05 10:35:50.875	2025-07-05 10:35:50.875	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmcqqx3lk0003sb8nn3bfigse	Yep	2025-07-05 21:18:53.049	2025-07-05 21:18:53.049	3f5d507b-2082-4238-9723-b3be36c64dfb	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq3y5ej0000sbgl69p0kcou	f
cmcqqx9tt0006sb8nfg87ah17	Yippie i yo	2025-07-05 21:19:01.119	2025-07-05 21:19:01.119	3f5d507b-2082-4238-9723-b3be36c64dfb	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq3y5ej0000sbgl69p0kcou	f
cmctvu1mi0003sbeaeizqn1dv	sub comment	2025-07-08 01:59:47.13	2025-07-08 01:59:47.13	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcqqx9tt0006sb8nfg87ah17	f
cmctvyyvb000esbea58dbqh6c	hi ho	2025-07-08 02:03:36.84	2025-07-08 02:03:36.84	3f5d507b-2082-4238-9723-b3be36c64dfb	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmctvu1mi0003sbeaeizqn1dv	f
cmi323eho0004wgrldim2j7o6	Very nice, Jordan!	2025-11-17 11:23:28.668	2025-11-17 11:23:28.668	97905467-addb-4ec3-a161-95465418fbd6	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmkvvlejs0000wg9pj1n26gmf	:) :)	2026-01-27 00:46:15.013	2026-01-27 00:46:15.013	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcqqx9tt0006sb8nfg87ah17	f
cmkvvmgwk0003wg9pyrf5wm01	Hello!	2026-01-27 00:47:04.724	2026-01-27 00:47:04.724	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmctvu1mi0003sbeaeizqn1dv	f
cmkvvngew0004wg9pojov02ts	hi	2026-01-27 00:47:50.744	2026-01-27 00:47:50.744	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmctvyyvb000esbea58dbqh6c	f
cmkvvnums0007wg9pqq456iyz	hi	2026-01-27 00:48:09.172	2026-01-27 00:48:09.172	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcqqx3lk0003sb8nn3bfigse	f
cml3epbuv0005wg72ls82qfov	543245	2026-02-01 07:15:34.087	2026-02-01 07:15:34.087	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkz037ey0019wgnb26ai1pet	f
cmkvwj825000nwg9pi9mp8qt6	Hi	2026-01-27 01:12:32.909	2026-01-27 01:12:32.909	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcqqx3lk0003sb8nn3bfigse	f
cmkz037ey0019wgnb26ai1pet	comeny	2026-01-29 05:15:22.57	2026-01-29 05:15:22.57	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cml3epwwe0006wg72t7thr6u6	686868	2026-02-01 07:16:01.358	2026-02-01 07:16:01.358	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvvnums0007wg9pqq456iyz	f
cmlivdiod0000wglmdqp079qs	Oohh, I really like these!	2026-02-12 02:58:49.164	2026-02-12 02:58:49.164	f074fdd0-1a11-4158-8fd7-5f9350371a31	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmlive7up0001wglm7cjemj7y	Yep, very nice.	2026-02-12 02:59:21.793	2026-02-12 02:59:21.793	f074fdd0-1a11-4158-8fd7-5f9350371a31	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmlivdiod0000wglmdqp079qs	f
cmkwwhmte0001wgoe0wdb4j9z	Hello	2026-01-27 17:59:04.898	2026-01-27 17:59:04.898	f074fdd0-1a11-4158-8fd7-5f9350371a31	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	f
cmkxqf1g40002wgdmzi17z6sc	Nice comment!	2026-01-28 07:56:52.372	2026-01-28 07:56:52.372	3f5d507b-2082-4238-9723-b3be36c64dfb	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmje8x70007sb36k5zmg7ms	f
cml03oos7000fwgokems1dgyz	2	2026-01-29 23:43:49.879	2026-01-29 23:43:49.879	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedcuux000esb5uyfmwopf6	f
cml03ot4y000gwgokfwnkudsk	3	2026-01-29 23:43:55.522	2026-01-29 23:43:55.522	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedcuux000esb5uyfmwopf6	f
cml03oxds000hwgokkme7kqts	4	2026-01-29 23:44:01.024	2026-01-29 23:44:01.024	d2b9df6f-4076-4a35-a847-722455398992	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedcuux000esb5uyfmwopf6	f
\.


--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."ContactMessage" (id, name, email, message, "userId", "createdAt", read, subject) FROM stdin;
728cb6fd-cc42-4aac-9582-413333786ccf	JCAdkins24	jordan.adkins111@gmail.com	Is this working?	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-19 02:24:51.673	f	question
93b8248b-dd6d-4c25-ad2a-2def24cc1dfc	Jordan Adkins	jordan.adkins111@gmail.com	This is just a general question. Is it working?	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 07:40:10.318	t	General Question
aaac2603-faec-47ae-907f-1ea109f03d9a	Jordan Adkins	jordan.adkins111@gmail.com	Howdy doody?	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 20:54:39.722	t	General Question
d0c24eb6-cde5-46f0-a000-3764c67914b2	JCAdkins24	jordan.adkins111@gmail.com	Hi, I just wanted to let you know that I absolutely love your website. Your posts give wonderful tips and tricks on how to use that camera that are invaluable to a beginner like myself.\n\nP.S. The images you post are just magnificent!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 21:16:28.932	t	feedback
5a8ba0b5-5573-4fda-80ca-18225c9fc0a8	JCAdkins24	jordan.adkins111@gmail.com	Hi, I just wanted to let you know that I absolutely love your website. Your posts give wonderful tips and tricks on how to use that camera that are invaluable to a beginner like myself.\n\nP.S. The images you post are just magnificent!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 21:20:33.359	t	feedback
b5fd8e4b-f392-4bdd-8c5d-3ffe58cc8b6e	JCAdkins24	jordan.adkins111@gmail.com	Hi, I just wanted to let you know that I absolutely love your website. Your posts give wonderful tips and tricks on how to use that camera that are invaluable to a beginner like myself.\n\nP.S. The images you post are just magnificent!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 21:28:24.951	t	feedback
fd0df5a5-f75b-4ba6-ba5b-e33cb0fea03c	JCAdkins24	jordan.adkins111@gmail.com	Hi, I just wanted to let you know that I absolutely love your website. Your posts give wonderful tips and tricks on how to use that camera that are invaluable to a beginner like myself.\n\nP.S. The images you post are just magnificent!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-06-05 21:24:29.733	t	feedback
8d9b972c-df3b-4e1b-8fdb-f77e33207dd6	JCAdkins24	jordan.adkins111@gmail.com	Tester McTestington!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-07-01 21:09:06.755	t	bug
150f3606-21d2-4ec8-83af-35c5514e7c57	JCAdkins24	jordan.adkins111@gmail.com	oijoijoij	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-07-01 21:14:47.728	t	question
5edf1da9-8e4f-4dae-82d5-cacb519945c2	JCAdkins24	jordan.adkins111@gmail.com	This is a test!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-07-01 20:54:56.066	t	question
fd6d67ba-5615-46af-8a17-6453e0ed0f31	JCAdkins24	jordan.adkins111@gmail.com	Hopefully final test!	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-07-01 21:17:17.195	t	question
5f56a3a7-e4d9-4027-aa4c-2a0fdebda223	JCAdkins24	jordan.adkins111@gmail.com	Testing bugs here -- that is all.	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2026-01-27 23:12:57.898	f	bug
6ec7d4ae-521d-40b9-8dfd-36d9a3676a10	MrCoolio	1234@gmail.com	Hey, bug here!	aa0c60ce-f39a-4565-93a9-fdf539c2da8e	2026-01-25 03:10:48.12	t	bug
09998337-d55e-473f-a0ae-12d0472b6a7c	JCAdkins24	jordan.adkins111@gmail.com	I'm just checking to see if this is still working correctly.	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2025-11-17 11:05:00.369	t	question
276b3227-eb0e-44cf-9194-b190357407fc	JCAdkins24	jordan.adkins111@gmail.com	I just want to report a bug on Blog "Something something"	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	2026-02-16 20:20:33.206	t	bug
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."Image" (id, status) FROM stdin;
3606af9d-04af-43be-8e91-4e080e6ef30f	duplicate
aa659782-a5c0-45bd-be72-c45ba6601332	duplicate
d5b5d9d3-de3f-423a-844e-b336714dc281	duplicate
16ef74b9-63db-49f5-9850-3cf4d1f1f8b9	duplicate
e8e3777f-a89e-44fa-977f-ab7504bbc3ce	duplicate
8079faa9-8116-445f-a018-c297f86343f2	created
3b5a3728-dad9-4563-b3c4-b6d85162eb22	created
61b900d2-fc14-4be6-8f66-6813a8cfcb9f	created
41b4fbd3-08d5-4191-bd40-3efae61f26db	created
e7c2110f-4dab-4528-aea1-5cb7d4a646e6	created
d0ada7cf-a4c3-4372-aa1c-690c2f01f8fb	created
f2199d2a-d259-4424-b4d0-ffc7598f7895	created
f72144ce-3809-4193-b452-20a9c5a7499e	created
a244607c-4934-4164-b6c2-0f74e7b6cf2e	created
e0e2d970-5a58-41be-b79f-9e6b63bffa8a	created
c30a59ba-1ef8-4fb3-8e85-d2d3732e60af	created
697330dc-ab01-4ab4-9c08-9142222300f6	created
3850f535-63e2-4cb1-ae00-31031e93f754	created
1daa1d17-d872-4e72-a2fd-d3da886411ad	created
b926a929-eb0f-4168-984d-dc1ed1f36374	created
9f18bf0d-25a9-4040-bf60-25955a19ab37	created
b0a6d25b-02ee-4ac6-83b1-591d43a1ee88	created
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."Like" (id, "userId", "commentId", "createdAt") FROM stdin;
cmcdwk64m001nsbpvexn3a3ad	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxlgjs0003sbhy4014mijy	2025-06-26 21:35:47.207
cmcdxil62002hsbpvu0ttsuxw	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcd1y5al0000sb80301zwk6x	2025-06-26 22:02:33.003
cmcg1pi4s0005sb5ovoa4kzlk	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxlgjs0003sbhy4014mijy	2025-06-28 09:35:26.476
cmcgt7m9y000asby5g3tr7gja	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmce76hbn0000sbzg614ps9oj	2025-06-28 22:25:21.286
cmcmkz6ad000hsb36qx53554e	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcmje8x70007sb36k5zmg7ms	2025-07-02 23:21:27.445
cmcoix4lq0005sbi21c5qbn9s	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccxzrkl0004sbhy966mr5te	2025-07-04 07:59:25.071
cmcoiy2il0009sbi231ld3bg2	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccwboq50000sbhyycdy8oyo	2025-07-04 08:00:09.022
cmcoqe7d70005sb5lo4p2h1q6	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:28:39.115
cmcu1tr6z0001sbm1ww6nossd	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmky3eu000dsb361lfdobxx	2025-07-08 04:47:31.306
cmcu1ts5g0005sbm1cem5s7dw	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq2p6zx0003sbj6c4b9n2bt	2025-07-08 04:47:32.549
cmcu4t6zp000bsbm15h5lwri2	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq2kzzx0000sbj6o7imnx4v	2025-07-08 06:11:03.974
cmcu682el000lsbm1fba5tyr8	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcondji90000sb5l9zxkmbbb	2025-07-08 06:50:37.485
cmcu6841j000nsbm1ar1gspdp	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq1d88h0000sbovthu2s9by	2025-07-08 06:50:39.607
cmi322sen0003wgrl1j783hly	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmje8x70007sb36k5zmg7ms	2025-11-17 11:23:00.048
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."Notification" (id, type, message, read, "userId", "commentId", "createdAt", "actorId", "replyId") FROM stdin;
cmkvvngh70006wg9p4yuod85m	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmctvyyvb000esbea58dbqh6c	2026-01-27 00:47:50.827	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvvngew0004wg9pojov02ts
cmkvw09is000gwg9p8zd6tz08	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2026-01-27 00:57:48.341	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cml33t3mr000fwgyphnxhrtko	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcmky3eu000dsb361lfdobxx	2026-02-01 02:10:34.275	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmctvtvtk0002sbeajtg1hzfh	REPLY	JCAdkins24 replied to your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2025-07-08 01:59:39.608	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmctvu1q80005sbea1wns9xuk	REPLY	JCAdkins24 replied to your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx9tt0006sb8nfg87ah17	2025-07-08 01:59:47.265	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmctvu1mi0003sbeaeizqn1dv
cmchiqv580003sbirp6lame0c	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmced695p0003sb5uso5o4209	2025-06-29 10:20:09.644	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmchisc8h0006sbirdm1n1wtt	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd3cq000hsb5uy9jisqd5	2025-06-29 10:21:18.449	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmchix8zq0009sbir5pyudae2	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd3cq000hsb5uy9jisqd5	2025-06-29 10:25:07.526	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcmky3mb000fsb36lczqqm98	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmje8x70007sb36k5zmg7ms	2025-07-02 23:20:37.332	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcoqdvr40003sb5lfugv675a	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:28:24.064	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcu1ts6t0007sbm1ufx62xe2	LIKE	JCAdkins24 liked your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq2p6zx0003sbj6c4b9n2bt	2025-07-08 04:47:32.598	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmcu1tr920003sbm158k9jl8j	LIKE	JCAdkins24 liked your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcmky3eu000dsb361lfdobxx	2025-07-08 04:47:31.383	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmcoix4mr0007sbi2rsp45dnw	LIKE	JCAdkins24 liked your comment.	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxzrkl0004sbhy966mr5te	2025-07-04 07:59:25.107	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmchj7ovg000jsbirv5r1800p	REPLY	JCAdkins24 replied to your comment.	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmchj4k0g000csbirkabctu62	2025-06-29 10:33:14.668	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmchawtc00002sb6pbm697azx	REPLY	JCAdkins24 liked your comment.	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmccxzrkl0004sbhy966mr5te	2025-06-29 06:40:50.304	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmkvvlf4w0002wg9p4eohcovr	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx9tt0006sb8nfg87ah17	2026-01-27 00:46:15.776	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvvlejs0000wg9pj1n26gmf
cmcoqedya000asb5l8ephr6nl	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:28:47.65	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcoqf3o3000dsb5lkmxcoc4p	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:29:20.98	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcoqfhze000gsb5l1657qlon	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:29:39.53	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcmkz7iw000jsb36aw75d1t9	LIKE	ImNotBeastly liked your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcmje8x70007sb36k5zmg7ms	2025-07-02 23:21:29.048	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcoqfmbl000jsb5ljjvorf2l	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:29:45.153	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcq2p71z0005sbj6oyykocsf	REPLY	ImNotBeastly replied to your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq2kzzx0000sbj6o7imnx4v	2025-07-05 10:00:53.495	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcq2p6zx0003sbj6c4b9n2bt
cmcoqe8240007sb5lyjjx0e5s	LIKE	ImNotBeastly liked your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcedd0j1000gsb5uzd1hvjzy	2025-07-04 11:28:40.012	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcu4t7ha000dsbm1j562lnlp	LIKE	ImNotBeastly liked your comment	f	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq2kzzx0000sbj6o7imnx4v	2025-07-08 06:11:04.607	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmkvvnuqu0009wg9pp6x0y7mv	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2026-01-27 00:48:09.318	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvvnums0007wg9pqq456iyz
cmkvwcyze000jwg9p44d3qg9e	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2026-01-27 01:07:41.21	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvwcyd3000hwg9pmv6tzgiu
cmctvw9sv000dsbeauc1pfzkq	LIKE	ImNotBeastly liked your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N	2025-07-08 02:01:31.039	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmkvw00zi000dwg9pecx9qyls	REPLY	JCAdkins24 replied to your comment	f	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2026-01-27 00:57:37.278	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmkvwj8o6000pwg9plyf4lyjt	REPLY	JCAdkins24 replied to your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse	2026-01-27 01:12:33.702	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmkvwj825000nwg9pi9mp8qt6
cmcpcxnhj000msb5lk7evv527	REPLY	ImNotBeastly replied to your comment.	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmccwboq50000sbhyycdy8oyo	2025-07-04 21:59:38.023	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcqqsu3w0002sb8nm1sscwph	REPLY	ImNotBeastly replied to your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq3y5ej0000sbgl69p0kcou	2025-07-05 21:15:34.125	f49bb485-0333-42b6-a9fa-12111c5eccdc	\N
cmcqqx3o20005sb8n35zi0104	REPLY	ImNotBeastly replied to your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq3y5ej0000sbgl69p0kcou	2025-07-05 21:18:53.139	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx3lk0003sb8nn3bfigse
cmcqqx9wj0008sb8n96ezwzno	REPLY	ImNotBeastly replied to your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq3y5ej0000sbgl69p0kcou	2025-07-05 21:19:01.22	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcqqx9tt0006sb8nfg87ah17
cmctvyyxz000gsbeat1vnt3u1	REPLY	ImNotBeastly replied to your comment	t	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmctvu1mi0003sbeaeizqn1dv	2025-07-08 02:03:36.935	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmctvyyvb000esbea58dbqh6c
cmchj5dtn000gsbirj6glgsac	REPLY	JCAdkins24 replied to your comment.	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmchj4k0g000csbirkabctu62	2025-06-29 10:31:27.036	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	\N
cmcq2l0n60002sbj6yzes7pwl	REPLY	JCAdkins24 replied to your comment	t	f49bb485-0333-42b6-a9fa-12111c5eccdc	cmcmky3eu000dsb361lfdobxx	2025-07-05 09:57:38.562	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	cmcq2kzzx0000sbj6o7imnx4v
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."User" (id, email, password, username, "createdAt", "updatedAt", role, "firstName", "lastName", "lastLoginAt", "activityVisible", image, "isVerified", location, "profileVisibility", "twoFactorEnabled") FROM stdin;
ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	jordan.adkins111@gmail.com	$2b$10$Y5vVZh/kVXuWRUDambUJPegKlbsGQGdL60xWt3ebjWuFu.LDPnaOu	JCAdkins24	2025-05-29 03:04:49.686	2026-02-24 02:07:20.623	admin	Jordan	Adkinsy	2026-02-24 02:07:20.623	t	b0a6d25b-02ee-4ac6-83b1-591d43a1ee88	f	\N	public	f
5dcfb298-a905-4785-8d56-4745829e8ff3	test@example.us	$2b$10$QVFrDiQs/0HzNb9O4ZYdJOrzDh4an2i/SJM6jihkQj/97IwJOVBli	Rocker	2025-06-30 07:10:06.717	2025-06-30 07:10:06.717	user			\N	t	\N	f	\N	users	f
e939b717-9de4-425a-8d04-5a75b1337928	test@test.com	$2b$10$aCAY6gDopP5WRMaf2y0DM.hZPMFfpKz8B/tZXwbs9fiW12ud.cq3W	Rojdann	2025-07-01 22:24:04.861	2025-07-01 22:24:04.861	user	Jordan 	Adkins	\N	t	\N	f	\N	users	f
aa0c60ce-f39a-4565-93a9-fdf539c2da8e	1234@gmail.com	$2b$10$RwOj5EZ3iKymWgH9HA0PpehkxLf0zmyBzym/LLmOs9daDKtfvnBhm	MrCoolio	2026-01-24 04:40:10.488	2026-01-24 04:40:10.488	user			\N	t	\N	f	\N	users	f
f49bb485-0333-42b6-a9fa-12111c5eccdc	the_bears_54@hotmail.com	$2b$10$z2LPVdo6SGoQiiGsmxpph.eDVOXdbFIdS9ldOlP4aEsbjz3yC/bjm	ImNotBeastly	2025-06-03 23:21:04.254	2026-02-22 21:43:53.929	user	Jordan	Adkins	2026-02-22 21:43:53.926	t	\N	f	\N	users	f
\.


--
-- Data for Name: UserSession; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public."UserSession" (id, "userId", device, browser, os, city, region, country, "ipAddress", "lastActiveAt", "createdAt", "isCurrent") FROM stdin;
d60f5439-603d-4120-a14c-204f440ae322	ad4b9fbb-a537-46c9-98af-2d2530b3c2ff	Apple Macintosh	Chrome 145.0.0.0	macOS 10.15.7			US	8.8.8.8	2026-02-24 02:07:20.613	2026-02-24 02:07:20.613	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: jordy
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
352e5eb6-5e30-4319-a54a-336a9ba7c7b4	7dcc446732639880957b08784d586a9bc3f42d9793c361cea65476d4973a6ef6	2026-02-18 15:54:27.313837-08	0001_baseline		\N	2026-02-18 15:54:27.313837-08	0
d736a720-d7f7-4f8f-aa2f-64bb0e7950b0	36daf5ead40c91359ac8e0d8d0da61519d8a94e14ce081e1e37fd93bce35d60b	2026-02-21 20:10:18.719361-08	20260222041018_add_2fa_to_user	\N	\N	2026-02-21 20:10:18.706193-08	1
\.


--
-- Name: BlogPostImage BlogPostImage_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."BlogPostImage"
    ADD CONSTRAINT "BlogPostImage_pkey" PRIMARY KEY ("blogPostId", "imageId");


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: UserSession UserSession_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."UserSession"
    ADD CONSTRAINT "UserSession_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Like_userId_commentId_key; Type: INDEX; Schema: public; Owner: jordy
--

CREATE UNIQUE INDEX "Like_userId_commentId_key" ON public."Like" USING btree ("userId", "commentId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: jordy
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: jordy
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: BlogPostImage BlogPostImage_blogPostId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."BlogPostImage"
    ADD CONSTRAINT "BlogPostImage_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BlogPostImage BlogPostImage_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."BlogPostImage"
    ADD CONSTRAINT "BlogPostImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."BlogPost"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContactMessage ContactMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Like Like_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_commentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_replyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSession UserSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jordy
--

ALTER TABLE ONLY public."UserSession"
    ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

