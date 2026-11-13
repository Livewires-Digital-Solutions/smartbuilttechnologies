-- Smart Built Technologies: careers database (MySQL 8 / MariaDB 10.6+).
--
-- Apply with:   npm run db:setup          (reads DB_* from .env.local / the environment)
-- or by hand:   mysql -u <user> -p <database> < db/schema.sql
--
-- Safe to run more than once: every statement is CREATE ... IF NOT EXISTS.
-- Create the database and its user first, for example:
--   CREATE DATABASE sbt_careers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--   CREATE USER 'sbt'@'localhost' IDENTIFIED BY '<strong password>';
--   GRANT ALL PRIVILEGES ON sbt_careers.* TO 'sbt'@'localhost';
--
-- All times are stored in UTC.

SET NAMES utf8mb4;

-- Job posts. Lists (responsibilities, requirements, benefits) are stored one item per line.
CREATE TABLE IF NOT EXISTS jobs (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug             VARCHAR(160) NOT NULL,
  title            VARCHAR(200) NOT NULL,
  department       VARCHAR(80)  NOT NULL,
  location         VARCHAR(120) NOT NULL,
  employment_type  ENUM('full_time','part_time','contract','internship') NOT NULL DEFAULT 'full_time',
  work_mode        ENUM('onsite','hybrid','remote') NOT NULL DEFAULT 'onsite',
  experience       VARCHAR(80)  NULL,
  salary           VARCHAR(120) NULL,
  summary          VARCHAR(400) NOT NULL,
  description      MEDIUMTEXT   NULL,
  responsibilities TEXT         NULL,
  requirements     TEXT         NULL,
  benefits         TEXT         NULL,
  -- draft: hidden. open: listed and accepting applications. closed: still reachable by link, no applications.
  status           ENUM('draft','open','closed') NOT NULL DEFAULT 'draft',
  featured         TINYINT(1)   NOT NULL DEFAULT 0,
  closes_on        DATE         NULL,
  published_at     DATETIME     NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_jobs_slug (slug),
  KEY idx_jobs_status (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Applications, from a job's own page or the general form (job_id is NULL for the general form).
-- `position` keeps the title as it was when the person applied, even if the job is edited or deleted later.
CREATE TABLE IF NOT EXISTS applications (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_id            INT UNSIGNED NULL,
  position          VARCHAR(200) NOT NULL,
  name              VARCHAR(120) NOT NULL,
  email             VARCHAR(254) NOT NULL,
  phone             VARCHAR(32)  NOT NULL,
  experience_years  VARCHAR(16)  NULL,
  message           TEXT         NULL,
  cv_path           VARCHAR(255) NOT NULL,
  cv_name           VARCHAR(255) NOT NULL,
  cv_mime           VARCHAR(100) NOT NULL,
  cv_size           INT UNSIGNED NOT NULL,
  status            ENUM('new','reviewing','shortlisted','interview','offered','hired','rejected') NOT NULL DEFAULT 'new',
  notes             TEXT         NULL,
  consent_at        DATETIME     NOT NULL,
  ip_hash           CHAR(64)     NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status_changed_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_applications_status (status, created_at),
  KEY idx_applications_job (job_id),
  KEY idx_applications_email (email),
  CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog posts: company news and articles. The body is Markdown. `cover` is a web path
-- (/media/<file> for an upload, or /assets/... for a file shipped with the site).
-- draft: hidden. published: listed and readable (a future published_at is still shown only once it has passed).
CREATE TABLE IF NOT EXISTS posts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(160) NOT NULL,
  kind         ENUM('news','article') NOT NULL DEFAULT 'article',
  title        VARCHAR(200) NOT NULL,
  excerpt      VARCHAR(400) NOT NULL,
  body         MEDIUMTEXT   NOT NULL,
  category     VARCHAR(60)  NULL,
  cover        VARCHAR(255) NULL,
  cover_alt    VARCHAR(200) NULL,
  status       ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_list (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events: exhibitions, conferences and milestones. `end_date` is for multi-day events.
-- The optional Markdown body gives an event its own page.
CREATE TABLE IF NOT EXISTS events (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(160) NOT NULL,
  title      VARCHAR(200) NOT NULL,
  type       VARCHAR(60)  NOT NULL,
  start_date DATE         NOT NULL,
  end_date   DATE         NULL,
  location   VARCHAR(120) NOT NULL,
  summary    VARCHAR(400) NULL,
  body       MEDIUMTEXT   NULL,
  cover      VARCHAR(255) NULL,
  cover_alt  VARCHAR(200) NULL,
  status     ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_events_slug (slug),
  KEY idx_events_list (status, start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
