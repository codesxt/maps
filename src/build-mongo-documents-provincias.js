const fs = require('fs')
const fsUtils = require('./utils/fs-utils')
const mongoose = require('mongoose')
const turf = require('@turf/turf')

fsUtils.createFolder('build/documents/comunas')
fsUtils.createFolder('build/documents/provincias')
fsUtils.createFolder('build/documents/regiones')

let provinciasGeojson = []
let provinciasGeojsonSimple = []
fs.readdirSync('./build/geojson/provincias').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson/provincias/' + file)
  provinciasGeojson.push(geojson)
})
fs.readdirSync('./build/geojson-simple/provincias').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson-simple/provincias/' + file)
  provinciasGeojsonSimple.push(geojson)
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

// Se generan los Object ID para las provincias
// Si ya se generaron, utilizar resultados
let provinciasIDs
provinciasIDsPath = './build/documents/provincias_ids.json'
if (fsUtils.fileExists(provinciasIDsPath)) {
  provinciasIDs = JSON.parse(fs.readFileSync(provinciasIDsPath, 'utf8'))
} else {
  provinciasIDs = {}
  for (let item of provinciasGeojson) {
    provinciasIDs[item.properties.COD_PROV] = new mongoose.Types.ObjectId()
  }
  fsUtils.writeJSONFile(
    provinciasIDsPath,
    provinciasIDs
  )
}

// Iterar provincias, cargar geometría simplificada
for (let i = 0; i < provinciasGeojson.length; i++) {
  const provinciaGeojson = provinciasGeojson[i]
  const provinciaGeojsonSimple = provinciasGeojsonSimple[i]
  const region_id = regionIDs[provinciaGeojson.properties.COD_REGI]
  const id = provinciasIDs[provinciaGeojson.properties.COD_PROV]

  let center = turf.center(provinciaGeojson.geometry).geometry
  let area = turf.area(provinciaGeojson.geometry) // Metros Cuadrados
  let bbox = turf.bbox(provinciaGeojson.geometry)

  let document = {
    _id: id,
    name: provinciaGeojson.properties.NOM_PROV,
    geo: provinciaGeojson.geometry,
    geoSimple: provinciaGeojsonSimple.geometry,
    bbox: bbox,
    center: center,
    meta: {
      area: area
    },
    region: region_id
  }
  fsUtils.writeJSONFile(
    'build/documents/provincias/' + document.name + '.json',
    document
  )
}
