--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Debian 14.17-1.pgdg120+1)
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
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'user',
    'manager'
);


ALTER TYPE public.role OWNER TO postgres;

--
-- Name: tag_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tag_type AS ENUM (
    'Fullstack',
    'DevOps',
    'Backend',
    'Frontend',
    'Pixi',
    'Docs',
    'Emergency',
    'WithoutTesting',
    'WithoutMediaTesting',
    'TLReview',
    'Bug'
);


ALTER TYPE public.tag_type OWNER TO postgres;

--
-- Name: vacancy; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vacancy AS ENUM (
    'Frontend',
    'Backend',
    'DevOps',
    'Project Manager',
    'Pixi',
    'Fullstack',
    'Docs',
    'Technical Director'
);


ALTER TYPE public.vacancy OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assignees (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.assignees OWNER TO postgres;

--
-- Name: assignees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assignees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignees_id_seq OWNER TO postgres;

--
-- Name: assignees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assignees_id_seq OWNED BY public.assignees.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    original_url character varying(255) NOT NULL,
    type character varying NOT NULL,
    local_path text NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: mr_commented_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mr_commented_users (
    id integer NOT NULL,
    mr_review_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.mr_commented_users OWNER TO postgres;

--
-- Name: mr_commented_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mr_commented_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mr_commented_users_id_seq OWNER TO postgres;

--
-- Name: mr_commented_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mr_commented_users_id_seq OWNED BY public.mr_commented_users.id;


--
-- Name: mr_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mr_comments (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    comment_link character varying(255) NOT NULL,
    assigned_user_id integer NOT NULL,
    mr_review_id integer NOT NULL
);


ALTER TABLE public.mr_comments OWNER TO postgres;

--
-- Name: mr_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mr_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mr_comments_id_seq OWNER TO postgres;

--
-- Name: mr_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mr_comments_id_seq OWNED BY public.mr_comments.id;


--
-- Name: mr_reviewers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mr_reviewers (
    id integer NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    mr_review_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.mr_reviewers OWNER TO postgres;

--
-- Name: mr_reviewers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mr_reviewers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mr_reviewers_id_seq OWNER TO postgres;

--
-- Name: mr_reviewers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mr_reviewers_id_seq OWNED BY public.mr_reviewers.id;


--
-- Name: mr_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mr_reviews (
    id integer NOT NULL,
    total_comments smallint DEFAULT 0 NOT NULL,
    unresolved_comments smallint DEFAULT 0 NOT NULL,
    total_reviewers smallint DEFAULT 0 NOT NULL,
    branch_behind_by smallint DEFAULT 0 NOT NULL,
    has_conflicts boolean DEFAULT false NOT NULL,
    changed_files_count smallint DEFAULT 0 NOT NULL,
    additions integer DEFAULT 0 NOT NULL,
    deletions integer DEFAULT 0 NOT NULL,
    duration_seconds integer DEFAULT 0 NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.mr_reviews OWNER TO postgres;

--
-- Name: mr_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mr_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mr_reviews_id_seq OWNER TO postgres;

--
-- Name: mr_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mr_reviews_id_seq OWNED BY public.mr_reviews.id;


--
-- Name: review_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_stats (
    id integer NOT NULL,
    mr_review_id integer NOT NULL,
    user_id integer NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.review_stats OWNER TO postgres;

--
-- Name: review_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_stats_id_seq OWNER TO postgres;

--
-- Name: review_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_stats_id_seq OWNED BY public.review_stats.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    type public.tag_type NOT NULL,
    weeek_id integer
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: task_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_messages (
    id integer NOT NULL,
    message_id integer NOT NULL,
    type character varying NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.task_messages OWNER TO postgres;

--
-- Name: task_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_messages_id_seq OWNER TO postgres;

--
-- Name: task_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_messages_id_seq OWNED BY public.task_messages.id;


--
-- Name: task_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_tags (
    task_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.task_tags OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    weeek_id integer NOT NULL,
    mr_id integer,
    mr_url character varying(255),
    task_url character varying(255),
    is_emergency boolean DEFAULT false NOT NULL,
    message_caption text NOT NULL,
    created_at timestamp without time zone,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_id_seq OWNER TO postgres;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: test_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_detail (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    link character varying(255) NOT NULL,
    is_completed boolean NOT NULL,
    test_id integer NOT NULL
);


ALTER TABLE public.test_detail OWNER TO postgres;

--
-- Name: test_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_detail_id_seq OWNER TO postgres;

--
-- Name: test_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_detail_id_seq OWNED BY public.test_detail.id;


--
-- Name: tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tests (
    id integer NOT NULL,
    total integer DEFAULT 0 NOT NULL,
    task_url character varying(255) DEFAULT NULL::character varying,
    is_needed boolean DEFAULT false NOT NULL,
    is_started boolean DEFAULT false NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    task_id integer NOT NULL
);


ALTER TABLE public.tests OWNER TO postgres;

--
-- Name: tests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tests_id_seq OWNER TO postgres;

--
-- Name: tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tests_id_seq OWNED BY public.tests.id;


--
-- Name: user_vacancies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_vacancies (
    user_id integer NOT NULL,
    vacancy public.vacancy NOT NULL
);


ALTER TABLE public.user_vacancies OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    telegram_id bigint NOT NULL,
    telegram_username character varying(32) NOT NULL,
    gitlab_id integer NOT NULL,
    weeek_id character varying NOT NULL,
    birthday timestamp without time zone NOT NULL,
    role public.role NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assignees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees ALTER COLUMN id SET DEFAULT nextval('public.assignees_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: mr_commented_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_commented_users ALTER COLUMN id SET DEFAULT nextval('public.mr_commented_users_id_seq'::regclass);


--
-- Name: mr_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_comments ALTER COLUMN id SET DEFAULT nextval('public.mr_comments_id_seq'::regclass);


--
-- Name: mr_reviewers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviewers ALTER COLUMN id SET DEFAULT nextval('public.mr_reviewers_id_seq'::regclass);


--
-- Name: mr_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviews ALTER COLUMN id SET DEFAULT nextval('public.mr_reviews_id_seq'::regclass);


--
-- Name: review_stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_stats ALTER COLUMN id SET DEFAULT nextval('public.review_stats_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: task_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_messages ALTER COLUMN id SET DEFAULT nextval('public.task_messages_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: test_detail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_detail ALTER COLUMN id SET DEFAULT nextval('public.test_detail_id_seq'::regclass);


--
-- Name: tests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests ALTER COLUMN id SET DEFAULT nextval('public.tests_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assignees (id, task_id, user_id) FROM stdin;
\.


--
-- Data for Name: attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attachments (id, original_url, type, local_path, task_id) FROM stdin;
\.


--
-- Data for Name: mr_commented_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mr_commented_users (id, mr_review_id, user_id) FROM stdin;
\.


--
-- Data for Name: mr_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mr_comments (id, comment_id, comment_link, assigned_user_id, mr_review_id) FROM stdin;
\.


--
-- Data for Name: mr_reviewers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mr_reviewers (id, is_approved, mr_review_id, user_id) FROM stdin;
\.


--
-- Data for Name: mr_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mr_reviews (id, total_comments, unresolved_comments, total_reviewers, branch_behind_by, has_conflicts, changed_files_count, additions, deletions, duration_seconds, task_id) FROM stdin;
\.


--
-- Data for Name: review_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_stats (id, mr_review_id, user_id, comments_count, created_at) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, type, weeek_id) FROM stdin;
1	Emergency	7
2	Backend	9
3	DevOps	11
4	Pixi	14
5	Frontend	8
6	Fullstack	13
7	WithoutMediaTesting	17
8	Docs	10
9	WithoutTesting	15
10	Bug	2
11	TLReview	18
\.


--
-- Data for Name: task_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_messages (id, message_id, type, task_id) FROM stdin;
\.


--
-- Data for Name: task_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_tags (task_id, tag_id) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, weeek_id, mr_id, mr_url, task_url, is_emergency, message_caption, created_at, is_completed, completed_at) FROM stdin;
\.


--
-- Data for Name: test_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_detail (id, name, link, is_completed, test_id) FROM stdin;
\.


--
-- Data for Name: tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tests (id, total, task_url, is_needed, is_started, is_completed, task_id) FROM stdin;
\.


--
-- Data for Name: user_vacancies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_vacancies (user_id, vacancy) FROM stdin;
8	Technical Director
9	Frontend
7	Project Manager
5	DevOps
2	Backend
10	Frontend
1	Backend
6	Frontend
11	Frontend
4	Pixi
12	Backend
3	Docs
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, last_name, telegram_id, telegram_username, gitlab_id, weeek_id, birthday, role) FROM stdin;
2	Ваня	Рабош	7	xol3pa	85	9d2604c8-e230-4f9f-8cb8-38e2929722bd	1990-01-01 00:00:00	user
3	Захар	Харазов	1	Zaharazov	13	9cb72ab0-ecec-46fb-acfb-e84b05c72c9f	1990-01-01 00:00:00	user
4	Vitalii	Pankov	3	vitalypankov	67	9cb729e0-9b9a-4487-b3f2-ee30597ab8b4	1990-01-01 00:00:00	user
5	notabeta	DevOps	8	notabeta	39	9cb76648-c131-47e1-b57a-b25865510f4f	1990-01-01 00:00:00	user
6	Toivo	Jija	5	Palm_Plaza	11	9cb71fba-be18-4540-b0f0-d77aea1b91d5	1990-01-01 00:00:00	user
7	Alina	PM	10	soulmaalina	88	9d84c2f1-3294-43d6-848e-01092b9f0358	1990-01-01 00:00:00	manager
8	Богдан	Mitursky	11	mitursky	3	9bba2a4b-24a4-4fe0-9a52-626b5fa6272b	1990-01-01 00:00:00	admin
9	A	Rome	9	its_ARome	16	9cb71f6b-4527-4740-a5fe-939e93cd122c	1990-01-01 00:00:00	user
10	Kamil	Karimov	6	KamilKar1mov	17	9cb61cdc-942d-4896-86c2-72e565616dfb	1990-01-01 00:00:00	user
11	Valentina	Burakova	4	vsm1703	80	9cce4b8d-12b1-4ce3-b8d6-6f35f877d93d	1990-01-01 00:00:00	user
12	Михаил	Backend	2	linuscce	35	9d1be586-d831-4402-8752-e21a3667d790	1990-01-01 00:00:00	user
1	scoffs		980157385	sc0ffs	26	9cb5b6ba-14ad-4703-ba80-169259efee0f	1990-01-01 00:00:00	admin
\.


--
-- Name: assignees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assignees_id_seq', 383, true);


--
-- Name: attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attachments_id_seq', 5, true);


--
-- Name: mr_commented_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mr_commented_users_id_seq', 321, true);


--
-- Name: mr_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mr_comments_id_seq', 2, true);


--
-- Name: mr_reviewers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mr_reviewers_id_seq', 1182, true);


--
-- Name: mr_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mr_reviews_id_seq', 247, true);


--
-- Name: review_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_stats_id_seq', 350, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 11, true);


--
-- Name: task_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_messages_id_seq', 545, true);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 389, true);


--
-- Name: test_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_detail_id_seq', 911, true);


--
-- Name: tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tests_id_seq', 373, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: assignees assignees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_pkey PRIMARY KEY (id);


--
-- Name: assignees assignees_task_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_task_id_user_id_unique UNIQUE (task_id, user_id);


--
-- Name: attachments attachments_local_path_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_local_path_unique UNIQUE (local_path);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: mr_commented_users mr_commented_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_commented_users
    ADD CONSTRAINT mr_commented_users_pkey PRIMARY KEY (id);


--
-- Name: mr_comments mr_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_comments
    ADD CONSTRAINT mr_comments_pkey PRIMARY KEY (id);


--
-- Name: mr_reviewers mr_reviewers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviewers
    ADD CONSTRAINT mr_reviewers_pkey PRIMARY KEY (id);


--
-- Name: mr_reviews mr_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviews
    ADD CONSTRAINT mr_reviews_pkey PRIMARY KEY (id);


--
-- Name: review_stats review_stats_mr_review_id_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_stats
    ADD CONSTRAINT review_stats_mr_review_id_user_id_unique UNIQUE (mr_review_id, user_id);


--
-- Name: review_stats review_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_stats
    ADD CONSTRAINT review_stats_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_type_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_type_unique UNIQUE (type);


--
-- Name: tags tags_weeek_id_type_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_weeek_id_type_unique UNIQUE (weeek_id, type);


--
-- Name: tags tags_weeek_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_weeek_id_unique UNIQUE (weeek_id);


--
-- Name: task_messages task_messages_message_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_messages
    ADD CONSTRAINT task_messages_message_id_unique UNIQUE (message_id);


--
-- Name: task_messages task_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_messages
    ADD CONSTRAINT task_messages_pkey PRIMARY KEY (id);


--
-- Name: task_tags task_tags_task_id_tag_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_task_id_tag_id_unique UNIQUE (task_id, tag_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_weeek_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_weeek_id_unique UNIQUE (weeek_id);


--
-- Name: test_detail test_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_detail
    ADD CONSTRAINT test_detail_pkey PRIMARY KEY (id);


--
-- Name: tests tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_pkey PRIMARY KEY (id);


--
-- Name: user_vacancies user_vacancies_user_id_vacancy_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_vacancies
    ADD CONSTRAINT user_vacancies_user_id_vacancy_unique UNIQUE (user_id, vacancy);


--
-- Name: users users_gitlab_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gitlab_id_unique UNIQUE (gitlab_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_telegram_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_telegram_id_unique UNIQUE (telegram_id);


--
-- Name: users users_telegram_username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_telegram_username_unique UNIQUE (telegram_username);


--
-- Name: users users_weeek_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_weeek_id_unique UNIQUE (weeek_id);


--
-- Name: assignees assignees_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: assignees assignees_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assignees
    ADD CONSTRAINT assignees_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attachments attachments_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_commented_users mr_commented_users_mr_review_id_mr_reviews_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_commented_users
    ADD CONSTRAINT mr_commented_users_mr_review_id_mr_reviews_id_fk FOREIGN KEY (mr_review_id) REFERENCES public.mr_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_commented_users mr_commented_users_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_commented_users
    ADD CONSTRAINT mr_commented_users_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_comments mr_comments_assigned_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_comments
    ADD CONSTRAINT mr_comments_assigned_user_id_users_id_fk FOREIGN KEY (assigned_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_comments mr_comments_mr_review_id_mr_reviews_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_comments
    ADD CONSTRAINT mr_comments_mr_review_id_mr_reviews_id_fk FOREIGN KEY (mr_review_id) REFERENCES public.mr_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_reviewers mr_reviewers_mr_review_id_mr_reviews_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviewers
    ADD CONSTRAINT mr_reviewers_mr_review_id_mr_reviews_id_fk FOREIGN KEY (mr_review_id) REFERENCES public.mr_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_reviewers mr_reviewers_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviewers
    ADD CONSTRAINT mr_reviewers_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: mr_reviews mr_reviews_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mr_reviews
    ADD CONSTRAINT mr_reviews_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_stats review_stats_mr_review_id_mr_reviews_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_stats
    ADD CONSTRAINT review_stats_mr_review_id_mr_reviews_id_fk FOREIGN KEY (mr_review_id) REFERENCES public.mr_reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_stats review_stats_user_id_users_itlab_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_stats
    ADD CONSTRAINT review_stats_user_id_users_itlab_id_fk FOREIGN KEY (user_id) REFERENCES public.users(gitlab_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_messages task_messages_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_messages
    ADD CONSTRAINT task_messages_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: task_tags task_tags_tag_id_tags_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_tag_id_tags_id_fk FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: task_tags task_tags_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: test_detail test_detail_test_id_tests_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_detail
    ADD CONSTRAINT test_detail_test_id_tests_id_fk FOREIGN KEY (test_id) REFERENCES public.tests(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tests tests_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tests
    ADD CONSTRAINT tests_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_vacancies user_vacancies_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_vacancies
    ADD CONSTRAINT user_vacancies_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

