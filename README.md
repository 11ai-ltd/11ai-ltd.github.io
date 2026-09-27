# 11AI Website

Static company website for 11AI Ltd, hosted on GitHub Pages. Plain HTML, CSS and JS, with no build step.

```
index.html        Home
omnicore.html     OmniCore (flagship platform, demo requests)
twincraft.html    TwinCraft (in development, register interest)
projects.html     Projects (CyberASAP: AI-powered honeypots)
about.html        Company, origins, principles
contact.html      Contact / demo request form
privacy.html      Privacy policy (UK GDPR)
404.html          Not-found page
assets/css        Styles
assets/js         Navigation, animations, form handling
assets/img        Logo (SVG), favicons, social image, redacted product visuals
_private/         Original unredacted images — git-ignored, never published
```

## 1. Site details

- Domain: `www.11ai.co.uk` (canonical URLs, sitemap, social previews and the `CNAME` file)
- Company details are in the footer of every page and in `privacy.html`
- **To do:** add the Companies House number to the footer line (`Registered in England & Wales.`) in every page and to `privacy.html`

## 2. Activate the contact form (sends to the company inbox)

The site shows no email address. Form messages are delivered by Web3Forms (free, 250 messages/month), and the destination address is never exposed in the page.

1. Go to https://web3forms.com, choose **Create Access Key** and enter the company inbox address.
2. Open the email Web3Forms sends to that inbox and copy the access key.
3. The key is set in `contact.html` (hidden `access_key` field). The key is safe to be public: it can only send messages to your inbox.

Each enquiry arrives with a subject like `11AI website: OmniCore: request a demo (Company)`. Pressing *Reply* answers the sender directly. 

## 3. Publish on GitHub Pages

1. In the company GitHub organisation, create a public repository (e.g. `website`, or `<org>.github.io`).
2. Upload the contents of this folder (the `_private/` folder is excluded by `.gitignore`):
   ```
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/<org>/<repo>.git
   git push -u origin main
   ```
3. Repository → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`.
4. In **Custom domain**, enter `www.YOUR-DOMAIN.com` and save. This creates a `CNAME` file in the repo.
5. Organisation → **Settings → Pages → Add a domain**: verify the domain (GitHub gives you a TXT record to add at GoDaddy). This stops anyone else from using your domain on GitHub.

## 4. Point the GoDaddy domain at GitHub

GoDaddy → **My Products → Domain → DNS**:

1. **Delete** the existing `A @ Parked` record, and turn off any GoDaddy *Forwarding* on the domain.
2. Add these records:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | `<org>.github.io` |
| TXT | `_github-pages-challenge-<org>` | *(value from GitHub, step 3.5)* |

3. **Do not change MX records** if you use email on this domain.
4. Wait for DNS to update (minutes to a few hours). Then in GitHub Pages settings, tick **Enforce HTTPS**.

Both `YOUR-DOMAIN.com` and `www.YOUR-DOMAIN.com` will then load the site over HTTPS.

## Editing content

- Header and footer are repeated in each page. If you change them, update every `.html` file.
- Colours and fonts are CSS variables at the top of `assets/css/style.css`.
- Product visuals are cropped and blurred on purpose, so no internal detail is readable. Keep that in mind when adding new screenshots.
