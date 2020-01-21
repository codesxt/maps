mkdir -p build/
topojson -o ./build/regiones.json -p --shapefile-encoding utf8 ./regiones/regiones.shp
topojson -o ./build/provincias.json -p --shapefile-encoding utf8 ./provincias/provincias.shp
topojson -o ./build/comunas.json -p --shapefile-encoding utf8 ./comunas/comunas.shp
topojson -o ./build/regiones-simple.json -p --shapefile-encoding utf8  --simplify-proportion 0.2 ./regiones/regiones.shp
topojson -o ./build/provincias-simple.json -p --shapefile-encoding utf8  --simplify-proportion 0.2 ./provincias/provincias.shp
topojson -o ./build/comunas-simple.json -p --shapefile-encoding utf8  --simplify-proportion 0.2 ./comunas/comunas.shp
