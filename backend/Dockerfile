# ==========================================================
# STAGE 1: Builder (Install dependencies & compile extensions)
# ==========================================================
FROM python:3.12-slim AS builder

WORKDIR /build

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install build dependencies for compiling binary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into /root/.local directory structure
RUN pip install --no-cache-dir --user -r requirements.txt


# ==========================================================
# STAGE 2: Runtime (Slim and secure environment for execution)
# ==========================================================
FROM python:3.12-slim AS runtime

WORKDIR /workspace

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH=/home/appuser/.local/bin:$PATH

# Install runtime PostgreSQL client library only (prevents bloat)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Add non-root system user for application execution (security hardening)
RUN groupadd -g 1000 appgroup && \
    useradd -u 1000 -g appgroup -m -s /bin/bash appuser

# Copy installed site-packages and binaries from builder stage
COPY --from=builder /root/.local /home/appuser/.local

# Copy backend application code
COPY --chown=appuser:appgroup . .

# Change ownership of the runtime directory
RUN chown -R appuser:appgroup /workspace

# Switch context to non-root user
USER appuser

EXPOSE 8000

# Start command suited for production (no reload, multiple workers can be specified)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
