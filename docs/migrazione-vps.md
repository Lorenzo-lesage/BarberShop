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
- Uscita completa da Ionos: dominio + DNS su Cloudflare, email via Resend + Cloudflare Email Routing

**Stima**: 15–20 ore (~2 settimane a 10 h/settimana)

> **▶ Dove siamo (27/11 sera)**: Fasi 0–3 completate, l'app gira su `barbershop.lorenzo99.abrdns.com` con CI/CD funzionante. Produzione ancora su Ionos.
> **Prossimo passo**: Fase 4, Passo 1 → creare account Cloudflare (password da Bitwarden + 2FA), *Add a domain* `barber-style.com`, piano Free, e **fermarsi alla lista dei record importati** per rivederla insieme (record mancanti? nuvola grigia "DNS only"?).
> **Da fare prima, quando capita**: nel pannello Ionos controllare il **preavviso di disdetta** e la data di rinnovo del contratto Spazio web; in Oracle impostare un **budget alert** (Billing → Budgets).

---

## Fase 0 — Verifiche preliminari

- [x] Architettura VPS: `aarch64` ✔ (PC locale `x86_64`: i test locali girano su amd64, l'immagine arm64 la fa solo GitHub Actions)
- [x] Piano Oracle: **Pay As You Go** ✔ → nessun recupero delle istanze inattive. Le risorse Always Free restano gratuite, ma oltre i limiti si paga → impostare un **budget alert** in Billing
- [x] Docker sulla VPS: 29.9.1, Compose v5.6.0 ✔
- [x] Sicurezza SSH lato server: password e keyboard-interactive disattivati, root solo con chiave ✔
- [x] Passphrase sulla chiave privata locale ✔ (salvata su Bitwarden)
- [x] Ionos: `mysqldump` disponibile (`/usr/bin/mysqldump`) ✔ — SSH Ionos: `ssh ionos` (con password)
- [x] Ionos gestisce **dominio + DNS + casella email**: registrar IONOS SE (scadenza **03/02/2027**), nameserver `ui-dns.*`, invio via `smtp.ionos.it` con casella `@barber-style.com`
  - ⚠️ Nessun record **MX, SPF, DMARC** sul dominio: le email partono ma rischiano lo spam, e la casella non riceve posta
  - Dal pannello: dominio e casella `barbershop@barber-style.com` (Mail Basic, 1 di 2) sono **dentro il contratto Spazio web** (dominio "aggiuntivo", rinnovo automatico) → disdire il contratto = perdere dominio ed email
  - ✅ **Deciso: uscire del tutto da Ionos** (vedi Fasi 4–7)
- [x] DNS del laboratorio: `lorenzo99.abrdns.com` è su **ClouDNS Free** (`ns71.cloudns.net`), che concede 1 sola zona → resta lì così com'è

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
- [x] Test da browser sul sottodominio: registrazione + login email/password ✔ (OAuth Google qui fallisce per design: la callback punta a `barber-style.com`)
- [x] Upload foto sul sottodominio: file presente nel volume `barbershop_storage` ✔
- [x] Test del ciclo completo: `gh workflow run docker.yml` → immagine nuova → Watchtower (controllo ogni 3 min) ricrea solo `barbershop` → notifica Gotify ✔

**Rollback**: nel compose sostituire `:latest` con `:sha-<commit>` di una versione buona, poi `make barbershop`. Tornare a `:latest` quando il fix è su main.

## Uscita da Ionos — decisioni (27/11)

| Cosa | Dove | Note |
|---|---|---|
| Dominio `barber-style.com` | **Cloudflare Registrar** | prezzo di costo, privacy WHOIS inclusa |
| DNS `barber-style.com` | **Cloudflare** (Free) | record del sito in **DNS only** (nuvola grigia), non Proxied |
| Email in arrivo `barbershop@` | **Cloudflare Email Routing** → Gmail personale | solo inoltro, nessuna casella |
| Email inviate dall'app | **Resend** via SMTP | cambia solo il `.env`; SPF + DKIM + DMARC |
| DNS laboratorio `lorenzo99.abrdns.com` | resta su **ClouDNS** | |

Scartati: ClouDNS anche per `barber-style.com` (servirebbe Premium S, ~35 $/anno, per la 2ª zona); Google Cloud DNS / OCI DNS (solo DNS, niente registrar né inoltro posta; DNS e server sullo stesso fornitore = singolo punto di rottura); mail server sulla VPS (porta 25 bloccata da Oracle, reputazione IP cloud).

**Ordine obbligato**: DNS → email → app → trasferimento dominio → disdetta. ⏰ Trasferimento **prima del 03/02/2027** (scadenza dominio). Controllare subito il **preavviso di disdetta** del contratto Ionos.

## Fase 4 — DNS su Cloudflare (dominio ancora registrato su Ionos)

- [ ] Account Cloudflare, aggiunta del sito `barber-style.com` (piano Free)
- [ ] Revisione dei record importati: A `@` → `217.160.0.99` (Ionos, per ora), aggiungere `www`; tutto in **DNS only**
- [ ] Ionos: se attivo, disattivare DNSSEC prima del cambio nameserver
- [ ] Ionos: nameserver personalizzati → i 2 nameserver assegnati da Cloudflare
- [ ] Cloudflare segnala il dominio "Active"; il sito su Ionos funziona come prima

## Fase 5 — Email

- [ ] Cloudflare Email Routing: `barbershop@barber-style.com` → Gmail (crea i record MX + SPF di routing)
- [ ] Resend: account, verifica del dominio (record DKIM/SPF su Cloudflare)
- [ ] Record DMARC (`_dmarc`), inizialmente `p=none`
- [ ] `.env` VPS: `MAIL_HOST`/`MAIL_PORT`/`MAIL_USERNAME`/`MAIL_PASSWORD` di Resend, `MAIL_FROM_ADDRESS=barbershop@barber-style.com` → ricreare il container
- [ ] Test: email inviata dall'app arriva in inbox (non spam); email inviata a `barbershop@` arriva su Gmail

## Fase 6 — Migrazione dell'app

- [ ] Eliminare l'account di prova creato per errore in produzione il 27/11
- [ ] `mysqldump` del DB da Ionos → import nel container MySQL della VPS
- [ ] Copia di `storage/app/public` (foto) dal server Ionos al volume `barbershop_storage`
- [ ] `APP_KEY` uguale a quella di Ionos
- [ ] Verifica sul sottodominio con i dati veri: login, prenotazione, immagini
- [ ] Proxy host NPM per `barber-style.com` + `www` → `barbershop:8080`, Let's Encrypt
- [ ] `.env` VPS: `APP_URL=https://barber-style.com`, `SESSION_DOMAIN=barber-style.com`, redirect OAuth su `barber-style.com` → ricreare il container
- [ ] Cloudflare: record A `@` (e `www`) → `84.8.253.164`
- [ ] Verifica finale: sito, login Google/GitHub, email
- [ ] Ultimo dump di sicurezza da Ionos (dati scritti durante lo switch)

## Fase 7 — Trasferimento del dominio e disdetta Ionos

- [ ] Ionos: sbloccare il dominio (togliere `clientTransferProhibited`) e richiedere il codice di autorizzazione (EPP)
- [ ] Cloudflare Registrar: avviare il trasferimento (aggiunge 1 anno di registrazione)
- [ ] Trasferimento completato: il dominio risulta su Cloudflare (`whois` → registrar Cloudflare)
- [ ] Solo dopo: disdetta del contratto Spazio web Ionos

## Fase 8 — Dopo la migrazione

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
