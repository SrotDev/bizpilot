Server scaffold for BizPilot

1. Copy `.env.example` to `.env` and fill in provider credentials (Google, GitHub), reCAPTCHA secret, and SSLCommerz merchant credentials.
2. Install deps: `npm install`
3. Run server: `npm run dev` (or `npm start`)

Notes:
- OAuth redirect URIs must match the ones configured in the provider dashboards.
- The server returns an insecure redirect to `/?oauth=...` with user info for development only. In production you MUST create/lookup users and issue a secure session cookie or token.
- SSLCommerz calls here are minimal. Follow official docs for exact parameters and response handling.

reCAPTCHA (client)
- The frontend expects a Vite env var named `VITE_RECAPTCHA_SITE_KEY` if you want to enable real reCAPTCHA. Add it to your Vite env (e.g. `.env.local`) as:

	VITE_RECAPTCHA_SITE_KEY=your-site-key

	The `Captcha` component will load grecaptcha automatically and return the token to the client, which should be posted to `/api/verify-recaptcha` for server-side verification.

LinkedIn
- If you want LinkedIn OAuth, register an app on LinkedIn and set the redirect URI to match `LINKEDIN_REDIRECT_URI` in `.env`.

