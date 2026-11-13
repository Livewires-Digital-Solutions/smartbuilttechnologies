# Careers, blog and events: setup and running on a VPS

The careers pages, the blog, the events pages and the admin area read and write **MySQL** (MariaDB 10.6+ also works), save CVs to **disk** on the server and send email through **nodemailer** (SMTP). Nothing here depends on Vercel.

| Part | Where |
| --- | --- |
| Public pages | `/careers` (open positions + application form), `/careers/<job>` (one position) |
| Application endpoint | `POST /api/apply` |
| Admin area | `/sys-ops` (one shared login), kept out of search engines |
| Database | `db/schema.sql`, applied with `npm run db:setup` |
| CV files | `UPLOAD_DIR` (default `./storage/cv`), never inside `public/` |
| Blog and events | `/blog`, `/blog/<post>`, `/events` (events), `/events/<event>`, managed at `/sys-ops/blog` and `/sys-ops/events` |
| Pictures | uploaded in the editors, stored in `MEDIA_DIR` (default `./storage/media`), served at `/media/<file>` |

## 1. Create the database

```sql
CREATE DATABASE sbt_careers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sbt'@'localhost' IDENTIFIED BY '<a strong password>';
GRANT ALL PRIVILEGES ON sbt_careers.* TO 'sbt'@'localhost';
```

## 2. Configure

Copy `.env.example` to `.env` on the server and fill it in. The important values:

- `DB_*`: the connection above.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` (or, better, `ADMIN_PASSWORD_HASH` from `npm run admin:hash -- "your password"`).
- `SESSION_SECRET`: 32+ random characters (`openssl rand -hex 32`). Changing it signs everyone out.
- `SITE_URL`: the public address. If it starts with `https://` the login cookie is marked Secure, so use https in production.
- `SMTP_*`, `MAIL_FROM`, `HR_EMAIL`: where email goes. With `SMTP_HOST` empty, applications are still saved and no email is sent.
- `UPLOAD_DIR`: an absolute path is best, for example `/var/lib/sbt/cv`, owned by the user that runs the site.

## 3. Create the tables, build, run

```bash
npm ci
npm run db:setup      # safe to run again: every statement is CREATE ... IF NOT EXISTS
npm run db:seed       # first time only: loads the starter articles and events (see below)
npm run build
npm run start         # or: npx next start -p 3000
```

Keep it running with your process manager (systemd or pm2), for example `pm2 start npm --name sbt -- start`.

## 4. Put nginx in front

```nginx
server {
  server_name www.smartbuilttech.com;
  client_max_body_size 10m;                     # CVs are at most 5 MB, pictures at most 8 MB

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;   # overwrite, so visitors cannot fake their address
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

The login throttle and the application limit count requests per address from `X-Forwarded-For`, so the proxy must set it as above.

## 5. Day to day

Sign in at `/sys-ops`.

- **Jobs**: post, edit, publish, close, reopen, duplicate or delete positions. A job is *draft* (hidden), *open* (listed and taking applications) or *closed* (its link still works, with no form). An optional closing date removes it from the list by itself.
- **Applications**: search and filter, open an applicant, download the CV, move them through New, Reviewing, Shortlisted, Interview, Offered, Hired or Rejected, keep private notes, delete, or export a CSV of the current filter.
- Changes show on the public site immediately; there is nothing to rebuild.

## 6. Blog and events

Sign in at `/sys-ops` and use **Blog** and **Events**.

- **Writing:** text is Markdown, with a toolbar (headings, bold, links, lists, quotes), a live preview that matches the public site, and **Add picture**, which uploads a picture and writes it into the text where the cursor is. A post or event can also have a cover picture.
- **Status:** a post or event is *draft* (hidden) or *published*. A post dated in the future stays hidden until that day. An event moves from "Upcoming" to "Where we have been" by itself once its last day has passed.
- **Events with a page:** an event's card links to its own page only if you write something in "About the event".
- **Starter content:** `npm run db:seed` loads the 6 articles, 1 news item and 7 events that came from txgksa.com, as published content you can edit. It is safe to run again: anything whose web address already exists is left exactly as it is, so your edits are never overwritten. The four 2023 articles are short teasers (as on txgksa.com); expand them in the editor.
- **Pictures:** JPG, PNG or WebP up to 8 MB. Each upload is checked by its content (not just its name), resized to at most 2400 px, and stripped of camera data such as GPS location. SVG is refused because it can carry script.
- **Home page:** the "What's happening" section shows the newest news item and the three newest articles, so publishing in the admin updates it straight away. If the database cannot be reached it falls back to the copy built into the site.

## Privacy and retention

The privacy notice at `/privacy` (draft, `src/content/privacy.ts`) promises to delete an application and its CV within 12 months of the position closing. Nothing does that automatically: open **Applications**, filter for the old ones and delete them (or export first), for example every quarter. See also `docs/seo-and-accessibility.md`.

## 7. What to back up

The **database**, the **`UPLOAD_DIR` folder** (CVs) and the **`MEDIA_DIR` folder** (pictures), together. An application row points at a CV file by name, and a post's cover or body points at a picture by name.

## Limits and behaviour worth knowing

- CVs: PDF, DOC or DOCX, up to 5 MB, checked by extension *and* file content.
- Pictures: JPG, PNG or WebP, up to 8 MB (`MEDIA_DIR`); raise nginx `client_max_body_size` above that, as shown.
- Applications: 10 per IP address per hour (`APPLY_RATE_LIMIT_PER_HOUR`); the same email cannot apply to the same position twice within a day.
- Admin login: 6 wrong attempts per 15 minutes per address, then a wait. Counters are in memory and reset when the server restarts.
- The login cookie lasts 8 hours and is signed, `HttpOnly` and `SameSite=Strict`.
- A mail problem never loses an application: it is saved first and the error is written to the server log.
- Dates in the admin area are shown in India Standard Time; the database stores UTC.
