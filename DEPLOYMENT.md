# EnglishFlow Deployment

EnglishFlow is static-first. The current app can be hosted without a backend because all working features use browser APIs and local JSON data.

## Recommended First Deployment: GitHub Pages

1. Create a GitHub repository, for example `englishflow-pwa`.
2. Push this folder to the repository.
3. In GitHub, open repository settings.
4. Go to Pages.
5. Choose deployment from the main branch root folder.
6. Open the GitHub Pages URL from a phone browser.
7. Install the PWA from the browser menu if the browser supports installation.

The included `.nojekyll` file tells GitHub Pages to serve files as-is.

## Alternative: Cloudflare Pages

1. Create a Cloudflare Pages project.
2. Connect the GitHub repository.
3. Use no build command.
4. Use the repository root as the output directory.
5. Deploy.

Cloudflare Pages is a good future choice if OpenAI features are implemented with a Cloudflare Worker.

## VPS Option

Any static web server can serve the folder. For example, Nginx can point its site root to this project directory or to a copied release folder.

For mobile installation, the app should be served over HTTPS. Most static hosting providers include HTTPS automatically.

## OpenAI Proxy Plan

When pronunciation feedback and dialogues are added, create a server-side endpoint. The frontend should call a public URL such as:

    https://your-domain.example/api/pronunciation-feedback
    https://your-domain.example/api/dialogue

The server-side endpoint stores the OpenAI API key. The static PWA never stores secrets.

## Deployment Checklist

- `index.html` opens from the deployment URL.
- `manifest.json` is reachable.
- `sw.js` is reachable.
- `data/*.json` files are reachable.
- The Cards tab loads words.
- The Games tab loads all four games.
- Progress survives a page reload on the same device.
- No OpenAI key or other secret appears in committed frontend files.

