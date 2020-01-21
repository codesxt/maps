const fs = require('fs')
const fsUtils = require('./utils/fs-utils')
const mongoose = require('mongoose')
const turf = require('@turf/turf')

fsUtils.createFolder('build/documents/comunas')
fsUtils.createFolder('build/documents/provincias')
fsUtils.createFolder('build/documents/regiones')

let comunasGeojson = []
let comunasGeojsonSimple = []
fs.readdirSync('./build/geojson/comunas').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson/comunas/' + file)
  comunasGeojson.push(geojson)
})
fs.readdirSync('./build/geojson-simple/comunas').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson-simple/comunas/' + file)
  comunasGeojsonSimple.push(geojson)
})

// Se asumen los Object ID para las regiones
let regionIDs
regionIDsPath = './build/documents/region_ids.json'
if (fsUtils.fileExists(regionIDsPath)) {
  regionIDs = JSON.parse(fs.readFileSync(regionIDsPath, 'utf8'))
} else {
  throw new Exception(
    'No están creados los ID de regiones. ' +
    'Primero deben generarse las regiones con el script buld-mongo-documents-regiones'
  )
}

// Se asumen los Object ID para las provincias
let provinciasIDs
provinciasIDsPath = './build/documents/provincias_ids.json'
if (fsUtils.fileExists(provinciasIDsPath)) {
  provinciasIDs = JSON.parse(fs.readFileSync(provinciasIDsPath, 'utf8'))
} else {
  throw new Exception(
    'No están creados los ID de regiones. ' +
    'Primero deben generarse las regiones con el script buld-mongo-documents-provincias'
  )
}

// Se generan los Object ID para las comunas
// Si ya se generaron, utilizar resultados
let comunasIDs
comunasIDsPath = './build/documents/comunas_ids.json'
if (fsUtils.fileExists(comunasIDsPath)) {
  comunasIDs = JSON.parse(fs.readFileSync(comunasIDsPath, 'utf8'))
} else {
  comunasIDs = {}
  for (let item of comunasGeojson) {
    comunasIDs[item.properties.CODIGO] = new mongoose.Types.ObjectId()
  }
  fsUtils.writeJSONFile(
    comunasIDsPath,
    comunasIDs
  )
}

// Iterar comunas, cargar geometría simplificada
for (let i = 0; i < comunasGeojson.length; i++) {
  const comunaGeojson = comunasGeojson[i]
  const comunaGeojsonSimple = comunasGeojsonSimple[i]

  if (comunaGeojson.properties.REGION == null) comunaGeojson.properties.REGION = 'Zona sin demarcar'
  let region = fsUtils.readJSONFile('./build/geojson-simple/regiones/' + comunaGeojson.properties.REGION + '.geojson')
  let provincia = fsUtils.readJSONFile('./build/geojson-simple/provincias/' + comunaGeojson.properties.PROV + '.geojson')

  const region_id = regionIDs[region.properties.COD_REGI]
  const provincia_id = provinciasIDs[provincia.properties.COD_PROV]

  const id = comunasIDs[comunaGeojson.properties.CODIGO]

  let center = turf.center(comunaGeojson.geometry).geometry
  let area = turf.area(comunaGeojson.geometry) // Metros Cuadrados
  let bbox = turf.bbox(comunaGeojson.geometry)

  let document = {
    _id: id,
    name: comunaGeojson.properties.NOM_COM,
    geo: comunaGeojson.geometry,
    geoSimple: comunaGeojsonSimple.geometry,
    bbox: bbox,
    center: center,
    meta: {
      area: area
    },
    region: region_id,
    province: provincia_id
  }
  fsUtils.writeJSONFile(
    'build/documents/comunas/' + document.name + '.json',
    document
  )
}
