#!/bin/bash

# release front end

ROOT_PATH=$(pwd)

DROP_PATH=$(pwd)/artifacts

MVN_PATH=/usr/local/Cellar/maven/apache-maven-3.8.2/bin/mvn


rm $DROP_PATH/*

echo "start releasing process"

echo "root path $ROOT_PATH"

echo "drop path: $DROP_PATH"

cd front/photo-app/ 

npm run build


tar -cvf $DROP_PATH/front.tar.gz build


echo "building backend"
cd $ROOT_PATH/backend/photo

$MVN_PATH package

cp target/photo.war $DROP_PATH/

