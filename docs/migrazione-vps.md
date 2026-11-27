# Migrazione BarberShop: Ionos → VPS Oracle (Docker) con CI/CD

**Obiettivo**: `git push` su `main` → build automatica su GitHub Actions → immagine su ghcr.io → Watchtower aggiorna il container sulla VPS. Niente più build e rsync a mano.

```
push main → GitHub Actions (build arm64) → ghcr.io → Watchtower (~3 min) → container riavviato (migrate + optimize) → notifica Gotify
```

**Decisioni prese**
- Deploy pull-based con **Watchtower** (già presente sulla VPS), non SSH da GitHub Actions
- Immagine base **`serversideup/php`** (PHP-FPM + Nginx, automazioni Laravel all'avvio)
- MySQL 8 in un container dedicato, **senza** label Watchtower
- Prima su sottodominio di test, poi switch DNS di `barber-style.com`

**Stima**: 15–20 ore (~2 settimane a 10 h/settimana)

---

## Fase 0 — Verifiche preliminari

- [x] Architettura VPS: `aarch64` ✔ (PC locale `x86_64`: i test locali girano su amd64, l'immagine arm64 la fa solo GitHub Actions)
- [ ] Piano Oracle: Always Free o Pay As You Go? (rischio recupero istanze inattive)
- [x] Docker sulla VPS: 29.9.1, Compose v5.6.0 ✔
- [x] Sicurezza SSH lato server: password e keyboard-interactive disattivati, root solo con chiave ✔
- [ ] Passphrase sulla chiave privata locale (`ssh-keygen -p -f ~/.ssh/id_ed25519`)
- [ ] Ionos: `mysqldump` disponibile via SSH? Host/nome DB di produzione
- [ ] Ionos: la casella SMTP è inclusa nel piano hosting? (se sì, alla disdetta serve un'alternativa: Resend / Brevo)

## Fase 1 — Dockerfile in locale (repo BarberShop)

Branch: `feat/docker-deploy`

- [x] `.dockerignore` (escludere `.env*`, `node_modules`, `vendor`, `public/build`, `storage/logs`, `.git`)
- [x] `Dockerfile` multi-stage
  - [x] stage Composer → `vendor` (`--no-dev`)
  - [x] stage Node → `npm ci && npm run build` (serve `vendor`: `tsconfig` punta `ziggy-js` in `vendor/tightenco/ziggy`); `VITE_*` come build args
  - [x] stage finale `serversideup/php:8.4-fpm-nginx` + estensione GD (WebP supportato ✔)
  - [x] automazioni all'avvio (`AUTORUN_ENABLED=true`): `storage:link`, `migrate --force`, `optimize`
- [x] `trustProxies` in `bootstrap/app.php` (solo `X-Forwarded-Proto`, l'IP reale lo gestisce Nginx con `TRUSTED_PROXY=local`)
- [x] `docker build` + `docker run` in locale con MySQL di test → migration ok, `/up` 200, registrazione e upload foto ok (OAuth non testabile in locale)
- [x] Commit

## Fase 2 — Pipeline GitHub Actions

- [x] `.github/workflows/docker.yml`: su PR verso `main` solo build (verifica), su push a `main` build + push
- [x] Controllo tipi: già incluso, `npm run build` = `tsc && vite build` dentro il Dockerfile → se `tsc` fallisce l'immagine non nasce
- [ ] ~~ESLint nella pipeline~~ → rimandato: oggi 1037 errori (1026 di formattazione Prettier, auto-fixabili). Da sistemare in un branch a parte, poi aggiungere il job
- [x] Build `linux/arm64` su runner `ubuntu-24.04-arm` (gratis per repo pubblici), push su `ghcr.io/lorenzo-lesage/barbershop` con tag `latest` + `sha-xxxxxxx` (~1m40s a run)
- [x] `VITE_*`: per ora basta il default `VITE_APP_NAME=BarberShop` nel Dockerfile
- [x] PR #1 aperta → run verde
- [x] Merge → immagine pubblicata: `latest` + `sha-1e3aae2`
- [x] Package **Public** (già di default, ereditato dal repo pubblico: pull anonimo del manifest → 200). Watchtower la scarica senza credenziali; contiene solo codice già pubblico, nessun segreto

## Fase 3 — Stack sulla VPS (repo Oracle-VM-Docker)

- [x] `docker/barbershop/docker-compose.yml`: `app` (label Watchtower, reti `reverse-proxy` + `barbershop_stack`) + `mysql` 8.4 (solo rete privata, healthcheck, niente label)
- [x] Target `barbershop` nel `Makefile` (+ fix parentesi mancanti in glances/passbolt/n8n)
- [x] `.env` di produzione **solo sulla VPS** (`chmod 600`), `docker/*/.env` in `.gitignore`. Utente DB dedicato `barbershop`, root casuale. Password salvata su Bitwarden
- [x] CNAME `barbershop` → `vps.lorenzo99.abrdns.com`
- [x] Proxy host NPM `barbershop.lorenzo99.abrdns.com` → `http://barbershop:8080`, Let's Encrypt (scade 25/02/2027, rinnovo automatico NPM), Force SSL
- [x] Raggiungibile: `/up` 200, HTTP → 301 HTTPS, asset generati in `https://` (trustProxies ok)
- [ ] Test da browser sul sottodominio: registrazione email/password, login, upload foto (OAuth Google qui fallisce per design: la callback punta a `barber-style.com`)
- [x] Test del ciclo completo: `gh workflow run docker.yml` → immagine nuova → Watchtower (controllo ogni 3 min) ricrea solo `barbershop` → notifica Gotify ✔

**Rollback**: nel compose sostituire `:latest` con `:sha-<commit>` di una versione buona, poi `make barbershop`. Tornare a `:latest` quando il fix è su main.

## Fase 4 — Migrazione dati e switch

- [ ] `mysqldump` del DB da Ionos → import nel container MySQL
- [ ] Copia di `storage/app/public` (foto saloni) dal server Ionos al volume
- [ ] Verifica sul sottodominio: login, OAuth, prenotazione, email, immagini
- [ ] Proxy host per `barber-style.com` in Nginx Proxy Manager
- [ ] Cambio record DNS A di `barber-style.com` → IP VPS
- [ ] `APP_URL` corretto, verifica callback OAuth (Google/GitHub)
- [ ] Ionos lasciato attivo qualche giorno come paracadute, poi disdetta

## Fase 5 — Dopo la migrazione

- [ ] Backup periodico del DB (candidato: workflow n8n)
- [ ] Aggiornare la sezione Deployment del README
- [ ] (Oracle-VM-Docker) spostare i segreti in chiaro dei compose in file `.env` non versionati

---

## Note e problemi incontrati

<!-- Aggiungere qui man mano: errori, soluzioni, decisioni cambiate -->

- **27/11** — Valutato CapRover e scartato: vuole le porte 80/443 (già di Nginx Proxy Manager) e gira su Docker Swarm, quindi andrebbero migrati tutti gli stack esistenti. Il Dockerfile servirebbe comunque.
- **27/11** — Test locale: porta `8090:8080` perché sul PC la 8080 è occupata da `cinebox_reverb`. Env di test in `~/barbershop-test.env` (fuori dal repo). `--env-file` prende i valori alla lettera: niente virgolette.
- **27/11** — Nel `.env` VPS `SESSION_DOMAIN=null` per il sottodominio di test (con `barber-style.com` il cookie non arriva → errori 419). **Da rimettere al passaggio definitivo.**
- **27/11** — L'Nginx di serversideup invia già `Strict-Transport-Security: max-age=31536000; includeSubDomains`: HSTS è attivo anche se in NPM è spento. Su `barber-style.com` vale per tutti i sottodomini → devono essere tutti HTTPS.
- **27/11** — Test di rete dalla VPS: `docker run --rm --network reverse-proxy curlimages/curl -sI http://barbershop:8080/up`.
- **27/11** — `gh api .../packages/...` risponde 404 anche se il package esiste: il token di `gh` non ha lo scope `read:packages` (`gh auth refresh -s read:packages` se serve).
- **27/11** — In MySQL il segnale di "pronto" è `mysqld: ready for connections ... port: 3306`; la riga con `port: 0` è il server temporaneo dell'init, quella con `33060` è l'X Plugin.
