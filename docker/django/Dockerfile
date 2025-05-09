<<<<<<< HEAD
# Start of Selection
FROM python:3.10-slim

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1 

# Installing system dependencies
RUN apt-get update && apt-get install -y  \
    postgresql-contrib \
    libpq-dev \
    python3-psycopg2 \
    postgis \
    gettext \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pip requirements
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
=======
# Start of Selection
FROM python:3.10-slim

EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1 

# Installing system dependencies
RUN apt-get update && apt-get install -y  \
    postgresql-contrib \
    libpq-dev \
    python3-psycopg2 \
    postgis \
    gettext \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pip requirements
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project files
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
COPY ./backend/tam_website/ .