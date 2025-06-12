-- CreateTable
CREATE TABLE "TipoDTE" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DTE" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rutEmisor" TEXT NOT NULL,
    "folio" INTEGER NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "razonSocialEmisor" TEXT NOT NULL,
    "rutReceptor" TEXT NOT NULL,
    "razonSocialReceptor" TEXT NOT NULL,
    "montoNeto" DECIMAL NOT NULL,
    "iva" DECIMAL NOT NULL,
    "total" DECIMAL NOT NULL,
    CONSTRAINT "DTE_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoDTE" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DTEItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dteId" INTEGER NOT NULL,
    "numeroLinea" INTEGER NOT NULL,
    "nombreItem" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "precio" DECIMAL NOT NULL,
    "monto" DECIMAL NOT NULL,
    CONSTRAINT "DTEItem_dteId_fkey" FOREIGN KEY ("dteId") REFERENCES "DTE" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CAF" (
    "codigo" TEXT NOT NULL PRIMARY KEY,
    "rutEmisor" TEXT NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "rangoInicio" INTEGER NOT NULL,
    "rangoTermino" INTEGER NOT NULL,
    CONSTRAINT "CAF_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoDTE" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DTE_rutEmisor_folio_tipoId_key" ON "DTE"("rutEmisor", "folio", "tipoId");

-- CreateIndex
CREATE UNIQUE INDEX "DTEItem_dteId_numeroLinea_key" ON "DTEItem"("dteId", "numeroLinea");
