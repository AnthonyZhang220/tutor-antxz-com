# tutor-antxz-com
A personal website for tutoring

## Frontend Structure

This site is a static frontend organized by concerns:

- `index.html`: shell file that mounts HTML partials and loads `script.js`.
- `partials/`: section-based HTML fragments.
- `styles.css`: global styles and responsive rules.
- `script.js`: bootstrap entry that loads partials, then starts app logic.
- `js/`: feature modules (`i18n`, language toggle, nav/dropdown, reveal animations, contact form).

### HTML partials

`index.html` now includes section placeholders using `data-include`, and `script.js` fetches:

- `partials/nav.html`
- `partials/hero.html`
- `partials/about.html`
- `partials/subjects.html`
- `partials/why.html`
- `partials/contact.html`
- `partials/footer.html`

After partials are injected, app initialization runs from `js/main.js` so existing interactions still work.

### JavaScript modules

- `js/i18n.js`: bilingual copy dictionary.
- `js/lang.js`: language state + DOM text/placeholder application.
- `js/nav.js`: hamburger menu, subjects dropdown, scroll spy.
- `js/reveal.js`: intersection-based reveal animations.
- `js/contact.js`: form validation, async submit, status feedback.
- `js/main.js`: application initializer.

## Contact Form Without Mail App (Cloudflare Worker)

This site now submits the contact form using `fetch` to an API endpoint instead of `mailto`.

### What was added

- Frontend UX improvements:
	- Inline validation (name/email/subject/message)
	- Loading button state
	- Success/error status message in-page
	- Honeypot spam trap field
	- Client cooldown to prevent repeat spam
	- One automatic retry for temporary failures
- Backend API worker:
	- `worker/contact-worker.js`
	- `worker/wrangler.toml`
	- Server-side validation + rate limit
	- Sends email via Resend API

### Deploy worker

1. Install Wrangler and login:

```bash
npm i -g wrangler
wrangler login
```

2. Set required secrets from `worker/` directory:

```bash
cd worker
wrangler secret put RESEND_API_KEY
wrangler secret put RESEND_FROM
wrangler secret put RESEND_TO
```

Notes:
- `RESEND_FROM` should be a verified sender, e.g. `Tutor Site <no-reply@yourdomain.com>`
- `RESEND_TO` should be your inbox (e.g. `anthonyzhang1997@gmail.com`)

3. (Optional, recommended) Create KV for stronger rate limiting:

```bash
wrangler kv namespace create RATE_LIMIT_KV
```

Then add the returned id to `worker/wrangler.toml` under `[[kv_namespaces]]`.

4. Set allowed origins in `worker/wrangler.toml`:

```toml
ALLOWED_ORIGINS = "https://tutor.antxz.com,https://www.tutor.antxz.com"
```

5. Deploy:

```bash
wrangler deploy
```

### Route / endpoint

Set a Cloudflare route so your website can call the worker at:

- `https://tutor.antxz.com/api/contact`

The frontend form already defaults to `data-endpoint="/api/contact"` in `index.html`.

If you host the worker on another domain, update `data-endpoint` to the full URL.
