# iconstruye-technical-lead-sii

Proyecto base en **Node.js + TypeScript** que expone un servidor **Express** y utiliza **Prisma ORM** con una base de datos **SQLite** (`dev.db`). Incluye las entidades

* **TipoDTE**
* **DTE**
* **DTEItem**
* **CAF**

> Los cuatro tipos de DTE más comunes (33, 34, 56 y 61) se insertan automáticamente mediante el script de _seed_.

---

## Requisitos

* Node.js ≥ 18
* npm (incluido con Node)

---

## Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/jvillane/iconstruye-technical-lead-sii.git
$ cd iconstruye-technical-lead-sii

# Instalar dependencias
$ npm install
```

---

## Scripts principales

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Arranca el servidor en modo desarrollo usando **ts-node**. |
| `npm run dev2` | Arranca el servidor en modo desarrollo usando **ts-node-dev** que permite captar las modificaciones a los archivos sin necesidad de reiniciarlo manualmente. |
| `npm run build` | Compila TypeScript a JavaScript en `dist/`. |
| `npm start` | Ejecuta la versión compilada (`node dist/index.js`). |
| `npm run prisma:generate` | Genera el cliente de Prisma a partir del archivo `prisma/schema.prisma`. |
| `npm run migrate` | Aplica las migraciones (y las crea si es la primera vez). Crea/actualiza `dev.db`. |
| `npm run seed` | Ejecuta `prisma/seed.ts` para insertar los datos iniciales (tipos DTE). |

---

## Base de datos y Prisma

### 1. Generar el cliente

```bash
npm run prisma:generate
```

Crea el cliente en `node_modules/@prisma/client`, necesario para que tu código pueda realizar consultas.

### 2. Crear / actualizar la base de datos

```bash
npm run migrate  # usa prisma migrate dev --name init
```

* Si es la primera vez, genera la base de datos SQLite `dev.db` en la raíz del proyecto.
* Si ya existe, aplica los cambios de esquema pendientes.

### 3. Insertar datos iniciales

```bash
npm run seed
```

Esto ejecuta `prisma/seed.ts` y hace _upsert_ de los cuatro **TipoDTE** por defecto (33, 34, 56, 61).

---

## Flujo típico de desarrollo

1. **Instalar dependencias**: `npm install`
2. **Generar cliente & migrar**: `npm run prisma:generate && npm run migrate`
3. **Seed opcional**: `npm run seed`
4. **Arrancar el servidor**: `npm run dev` o `npm run dev2` (para que se refresque el server inmediatamente con los cambios en el código)

¡Listo! Ya puedes empezar a agregar más endpoints y lógica de negocio. 

## ¿Cómo lo pruebo?

Dos alternativas:

* Revisar proactivamente la documentación disponible en el archivo `openapi.yaml`.
* Utilizar como referencia los requests de ejemplo que se encuentran en la carpeta `tests-requests`.

## ¿Qué falta?

* **Tests**: generar los tests para cada uno de los métodos que son parte de los controladores
* **Colas**: este es un proyecto simple, no pensado para escalar y sostener posibles inconsistencias en la información, por ejemplo si se realizan 2 o más peticiones concurrentes de creación de CAFs, las validaciones podrían no tener efecto, y se podrían crear CAFs inconsistentes a las reglas de negocio
* **Firma y certificados**: por tiempo no se consideró el incorporar la firma como parte del DTE, que en el caso del SII es una parte fundamental que garantiza la confiabilidad y el no repudio de su emisión.
* **Documentación API**: debería estar amarrada al desarrollo (mediante notaciones) y así obligar a que se mantenga actualizada.