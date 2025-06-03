@echo off
REM Stop PostgreSQL service
sc stop postgresql
REM Wait for the service to stop
timeout /t 5

REM Stop Redis service
sc stop redis
timeout /t 5

REM Remove all stopped containers (equivalent to 'docker container prune')
docker container prune -f

REM Remove containers named 'backend', 'frontend', 'database' if they exist
for /f "tokens=*" %%i in ('docker ps -aq -f "name=backend"') do (
    docker rm -f %%i
)

for /f "tokens=*" %%i in ('docker ps -aq -f "name=frontend"') do (
    docker rm -f %%i
)

for /f "tokens=*" %%i in ('docker ps -aq -f "name=database"') do (
    docker rm -f %%i
)

REM Run docker-compose up --build
docker-compose up --build