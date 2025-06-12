## Login
curl -X "POST" "http://localhost:3000/login" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "username": "admin",
  "password": "admin"
}'

## Tipo DTE List
curl "http://localhost:3000/tipo-dte" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN'

## CAF List
curl "http://localhost:3000/empresa/123/caf" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN'

## CAF Create Malo
curl -X "POST" "http://localhost:3000/empresa/123/caf" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "tipoId": 31,
  "rangoInicio": 1,
  "rangoTermino": 100
}'

## CAF Create Bueno
curl -X "POST" "http://localhost:3000/empresa/123/caf" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "tipoId": 33,
  "rangoInicio": 1,
  "rangoTermino": 200
}'

## DTE Create Malo
curl -X "POST" "http://localhost:3000/empresa/123/dte" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "folio": 120,
  "tipoId": 33,
  "rutReceptor": "98765432-1",
  "razonSocialEmisor": "Emisor S.A.",
  "codigoCaf": "f813a58e-7c9a-4a3d-8d6f-9b556ad1e3ab",
  "iva": 1900,
  "total": 11900,
  "razonSocialReceptor": "Receptor Ltda.",
  "montoNeto": 10000,
  "items": [
    {
      "nombreItem": "Producto A",
      "numeroLinea": 1,
      "cantidad": 2,
      "precio": 5000,
      "monto": 10000
    }
  ]
}'

## DTE Create Bueno
curl -X "POST" "http://localhost:3000/empresa/123/dte" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "folio": 1,
  "tipoId": 33,
  "rutReceptor": "98765432-1",
  "razonSocialEmisor": "Emisor S.A.",
  "codigoCaf": "c278a546-82b5-4c0d-bfe6-9ee36051a6b5",
  "iva": 1901,
  "total": 11900,
  "razonSocialReceptor": "Receptor Ltda.",
  "montoNeto": 10000,
  "items": [
    {
      "nombreItem": "Producto A",
      "numeroLinea": 1,
      "cantidad": 2,
      "precio": 5000,
      "monto": 10000
    }
  ]
}'

## DTE Obtener
curl "http://localhost:3000/empresa/123/dte?tipoDte=33&folio=1" \
     -H 'Authorization: Bearer JSON_WEB_TOKEN' \
     -H 'Content-Type: application/json; charset=utf-8'
