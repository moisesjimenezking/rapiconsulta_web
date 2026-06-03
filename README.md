# RapiConsulta - Frontend

Interfaz web estatica para consultar cedulas y RIF venezolanos. Consume la API de RapiConsulta a traves del Cloudflare Worker.

## Archivos

```
pages/
├── index.html      # Pagina principal
├── config.js       # Configuracion de URL del Worker y mocks
├── css/            # Estilos
├── js/             # Logica del frontend
│   ├── script.js   # Consultas, renderizado de resultados, modales
│   └── mocks.js    # Datos de prueba para desarrollo
└── img/            # Imagenes y logos
```

## Configuracion

Edita `config.js` para apuntar a tu Worker:

```js
const CONFIG = {
  API_BASE_URL: "https://tu-worker.workers.dev",
  USE_MOCKS: false,    // true para desarrollo sin API
  MOCK_DELAY: 800
};
```

## Desarrollo local

Sirve la carpeta con cualquier servidor estatico:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080` y listo. Cambia `USE_MOCKS: true` en `config.js` si no tienes el Worker corriendo.

## Despliegue (Cloudflare Pages)

1. Conecta el repo a Cloudflare Pages
2. Directorio raiz: `pages`
3. Comando de build: (vacio, es estatico)
4. Despliega
