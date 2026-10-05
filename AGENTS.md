<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the DWP V2 public experience on the approved Home plus dedicated Services, Method, About, and Contact routes; share navigation and the established visual system across them because WI-DWPWEB-301 authorizes this site structure.
- Production is a fully static GitHub Pages site: nitro is disabled and `scripts/prerender-static.mjs` renders every public route (plus 404.html) into `dist/client`, which `.github/workflows/deploy.yml` publishes, because hosting has no server runtime.
- Keep `CNAME` and `public/CNAME` pointing at the production domain, because GitHub Pages custom-domain behavior depends on CNAME being in the artifact.
- Keep images as real repository assets under `src/assets`, never Lovable asset pointers, because GitHub Pages cannot resolve Lovable-internal URLs.
