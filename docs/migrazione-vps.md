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
- [ ] Commit

## Fase 2 — Pipeline GitHub Actions

- [ ] `.github/workflows/deploy.yml`: trigger su push a `main`
- [ ] Job di controllo: `tsc` + ESLint (blocca il deploy se fallisce)
- [ ] Build `linux/arm64` su runner `ubuntu-24.04-arm`, push su `ghcr.io` con tag `latest` + SHA del commit
- [ ] `VITE_*` passati come secrets/variables del repo
- [ ] Primo run verde, immagine visibile su ghcr.io

## Fase 3 — Stack sulla VPS (repo Oracle-VM-Docker)

- [ ] `docker/barbershop/docker-compose.yml`: `app` (label Watchtower, reti `reverse-proxy` + interna) + `mysql` (volume dedicato, niente label)
- [ ] Target `barbershop` nel `Makefile` (creazione volumi + `docker_rebuild`)
- [ ] `.env` di produzione **solo sulla VPS**, aggiunto a `.gitignore`
- [ ] Proxy host in Nginx Proxy Manager su sottodominio di test → `barbershop:8080` + SSL Let's Encrypt
- [ ] App raggiungibile sul sottodominio (con DB vuoto)
- [ ] Test del ciclo completo: push banale → Watchtower aggiorna → notifica Gotify

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
- **27/11** — In MySQL il segnale di "pronto" è `mysqld: ready for connections ... port: 3306`; la riga con `port: 0` è il server temporaneo dell'init, quella con `33060` è l'X Plugin.
