#!/bin/bash

ROOT=/root
DEPLOY_PATH_FRONT=/root/front
DEPLOY_PATH_END=/data/wwwroot/default/photo.war
GIT_ROOT_PATH=/root/photoReleae/photo-print-release
TOMCAT_PATH=/usr/local/tomcat


cd $GIT_ROOT_PATH

git pull

pm2 stop static-page-server-80

rm -rf $DEPLOY_PATH_FRONT/build

mkdir -p $DEPLOY_PATH_FRONT

tar -xvf front.tar.gz

mv build $DEPLOY_PATH_FRONT

cp photo.war $DEPLOY_PATH_END

cd $TOMCAT_PATH

bin/catalina.sh stop

bin/catalina.sh start

cd $ROOT

pm2 serve $DEPLOY_PATH_FRONT/build 80 --spa 