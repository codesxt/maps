const fs = require('fs')
const fsUtils = require('./utils/fs-utils')

// Archivos de Origen
// Regiones
const regiones = JSON.parse(fs.readFileSync('./data/geojson/regiones.geojson'))
const regionesSimple = JSON.parse(fs.readFileSync('./data/geojson/regiones-simple.geojson'))

fsUtils.createFolder('build/geojson/regiones')
fsUtils.createFolder('build/geojson-simple/regiones')

for (let region of regiones.features) {
  fsUtils.writeJSONFile(
    'build/geojson/regiones/' + region.properties.NOM_REG + '.geojson',
    region
  )
}

for (let region of regionesSimple.features) {
  fsUtils.writeJSONFile(
    'build/geojson-simple/regiones/' + region.properties.NOM_REG + '.geojson',
    region
  )
}

// Provincias
const provincias = JSON.parse(fs.readFileSync('./data/geojson/provincias.geojson'))
const provinciasSimple = JSON.parse(fs.readFileSync('./data/geojson/provincias-simple.geojson'))

fsUtils.createFolder('build/geojson/provincias')
fsUtils.createFolder('build/geojson-simple/provincias')

for (let provincia of provincias.features) {
  fsUtils.writeJSONFile(
    'build/geojson/provincias/' + provincia.properties.NOM_PROV + '.geojson',
    provincia
  )
}

for (let provincia of provinciasSimple.features) {
  fsUtils.writeJSONFile(
    'build/geojson-simple/provincias/' + provincia.properties.NOM_PROV + '.geojson',
    provincia
  )
}

// Comunas
const comunas = JSON.parse(fs.readFileSync('./data/geojson/comunas.geojson'))
const comunasSimple = JSON.parse(fs.readFileSync('./data/geojson/comunas-simple.geojson'))

fsUtils.createFolder('build/geojson/comunas')
fsUtils.createFolder('build/geojson-simple/comunas')

for (let comuna of comunas.features) {
  fsUtils.writeJSONFile(
    'build/geojson/comunas/' + comuna.properties.NOM_COM + '.geojson',
    comuna
  )
}

for (let comuna of comunasSimple.features) {
  fsUtils.writeJSONFile(
    'build/geojson-simple/comunas/' + comuna.properties.NOM_COM + '.geojson',
    comuna
  )
}
