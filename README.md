# X-Chang (x-chang-frontend)

## Install the dependencies

```bash
pnpm install
# or: yarn/npm/bun install
```

### Start the app in development mode (HMR, error reporting, etc.)

```bash
quasar dev
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Despliegue local con Docker

El frontend se levanta solo desde este repositorio. El backend está en un repositorio
independiente: [exchange-divisas-DAW2026](https://github.com/csMattias09/exchange-divisas-DAW2026),
y debe estar corriendo en http://localhost:5198 (ver su README).

```bash
git clone https://github.com/csMattias09/intercambio_Divisas_Front_Web.git
cd intercambio_Divisas_Front_Web
docker compose up --build
```

- Aplicacion: http://localhost:9200

Si el backend corre en otra direccion, cambiar `API_URL` y `ASSET_BASE_URL` en `docker-compose.yml`.

El documento de la entrega está en `Formato de Proyecto 2026-02.docx`.
