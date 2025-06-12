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

### 4. Explorar la base de datos (opcional)

```bash
npx prisma studio
```

Abre Prisma Studio en tu navegador para explorar y editar visualmente los registros.

---

## Ejemplo de uso de Prisma en el código

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todos los tipos DTE
const tipos = await prisma.tipoDTE.findMany();

// Crear un nuevo DTE
await prisma.dTE.create({
  data: {
    rutEmisor: '12345678-9',
    folio: 1,
    tipoId: 33,
    razonSocialEmisor: 'Emisor S.A.',
    rutReceptor: '98765432-1',
    razonSocialReceptor: 'Receptor Ltda.',
    montoNeto: 10000,
    iva: 1900,
    total: 11900,
    items: {
      create: [
        {
          numeroLinea: 1,
          nombreItem: 'Producto A',
          cantidad: 2,
          precio: 5000,
          monto: 10000,
        },
      ],
    },
  },
});
```

---

## Flujo típico de desarrollo

1. **Instalar dependencias**: `npm install`
2. **Generar cliente & migrar**: `npm run prisma:generate && npm run migrate`
3. **Seed opcional**: `npm run seed`
4. **Arrancar el servidor**: `npm run dev`

¡Listo! Ya puedes empezar a agregar más endpoints y lógica de negocio. 