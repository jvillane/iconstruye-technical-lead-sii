-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DTE" (
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
    "estado" TEXT NOT NULL DEFAULT 'EN_REVISION',
    "glosa" TEXT,
    CONSTRAINT "DTE_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoDTE" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DTE" ("folio", "id", "iva", "montoNeto", "razonSocialEmisor", "razonSocialReceptor", "rutEmisor", "rutReceptor", "tipoId", "total") SELECT "folio", "id", "iva", "montoNeto", "razonSocialEmisor", "razonSocialReceptor", "rutEmisor", "rutReceptor", "tipoId", "total" FROM "DTE";
DROP TABLE "DTE";
ALTER TABLE "new_DTE" RENAME TO "DTE";
CREATE UNIQUE INDEX "DTE_rutEmisor_folio_tipoId_key" ON "DTE"("rutEmisor", "folio", "tipoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
