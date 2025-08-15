FROM python:3.10-slim

EXPOSE 8000

# Prevent .pyc files and enable unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

# Install only necessary system dependencies (PostgreSQL & i18n)
RUN apt-get update && apt-get install -y  \
    libpq-dev \
    gettext \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY ./backend/tam_website/ .
