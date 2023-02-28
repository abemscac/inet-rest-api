#!/bin/bash
docker container ls -qa --filter name=inet-dev-mysql | xargs docker container stop
docker container ls -qa --filter name=inet-dev-mysql | xargs docker container rm
docker rmi -f inet-dev-mysql