#!/bin/bash
docker build -t inet-dev-mysql -f ./dev-test-db-dockerfile .
docker run --name inet-dev-mysql -dp 3308:3306 inet-dev-mysql