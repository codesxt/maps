const fs = require('fs')
const fsUtils = require('./utils/fs-utils')
const mongoose = require('mongoose')
const turf = require('@turf/turf')

fsUtils.createFolder('build/documents/comunas')
fsUtils.createFolder('build/documents/provincias')
fsUtils.createFolder('build/documents/regiones')

let regionesGeojson = []
let regionesGeojsonSimple = []
fs.readdirSync('./build/geojson/regiones').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson/regiones/' + file)
  regionesGeojson.push(geojson)
})
fs.readdirSync('./build/geojson-simple/regiones').forEach(file => {
  const geojson = fsUtils.readJSONFile('./build/geojson-simple/regiones/' + file)
  regionesGeojsonSimple.push(geojson)
})

// Se generan los Object ID para las regiones
// Si ya se generaron, utilizar resultados
let regionIDs
regionIDsPath = './build/documents/region_ids.json'
if (fsUtils.fileExists(regionIDsPath)) {
  regionIDs = JSON.parse(fs.readFileSync(regionIDsPath, 'utf8'))
} else {
  regionIDs = {}
  for (let item of regionesGeojson) {
    regionIDs[item.properties.COD_REGI] = new mongoose.Types.ObjectId()
  }
  fsUtils.writeJSONFile(
    regionIDsPath,
    regionIDs
  )
}

// Iterar regiones, cargar geometría simplificada
for (let i = 0; i < regionesGeojson.length; i++) {
  const regionGeojson = regionesGeojson[i]
  const regionGeojsonSimple = regionesGeojsonSimple[i]
  const id = regionIDs[regionGeojson.properties.COD_REGI]

  let center = turf.center(regionGeojson.geometry).geometry
  let area = turf.area(regionGeojson.geometry) // Metros Cuadrados
  let bbox = turf.bbox(regionGeojson.geometry)

  let document = {
    _id: id,
    name: regionGeojson.properties.NOM_REG,
    geo: regionGeojson.geometry,
    geoSimple: regionGeojsonSimple.geometry,
    bbox: bbox,
    center: center,
    meta: {
      area: area
    }
  }
  fsUtils.writeJSONFile(
    'build/documents/regiones/' + document.name + '.json',
    document
  )
}
