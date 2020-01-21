const fs = require('fs')
const fsUtils = require('./utils/fs-utils')

let files = [
  {
    old: './build/geojson/provincias/Chiloe.geojson',
    new: './build/geojson/provincias/Chiloé.geojson'
  },
  {
    old: './build/geojson-simple/provincias/Chiloe.geojson',
    new: './build/geojson-simple/provincias/Chiloé.geojson'
  },
  {
    old: './build/geojson-simple/regiones/Región de La Araucana.geojson',
    new: './build/geojson-simple/regiones/Región de La Araucanía.geojson'
  },
  {
    old: './build/geojson/regiones/Región de La Araucana.geojson',
    new: './build/geojson/regiones/Región de La Araucanía.geojson'
  },
  {
    old: './build/geojson/provincias/San Felipe.geojson',
    new: './build/geojson/provincias/San Felipe de Aconcagua.geojson'
  },
  {
    old: './build/geojson-simple/provincias/San Felipe.geojson',
    new: './build/geojson-simple/provincias/San Felipe de Aconcagua.geojson'
  },
  {
    old: './build/geojson-simple/provincias/Ultima Esperanza.geojson',
    new: './build/geojson-simple/provincias/Última Esperanza.geojson'
  },
  {
    old: './build/geojson/provincias/Ultima Esperanza.geojson',
    new: './build/geojson/provincias/Última Esperanza.geojson'
  }
]
for(let file of files) {
  if (fsUtils.fileExists(file.old)) {
    fs.renameSync(file.old, file.new)
  }
}
