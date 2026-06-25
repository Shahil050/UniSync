FROM python:3.12-slim

WORKDIR /app

# Install system dependencies required for FAISS runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install directly
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set system optimization environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy remaining application code
COPY . .

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]







# # --- Stage 1: The Builder ---
# FROM python:3.10-slim as builder

# WORKDIR /build

# # Install build tools temporarily
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libssl-dev \
#     && rm -rf /var/lib/apt/lists/*

# # Copy requirements and install to a local folder
# COPY requirements.txt .
# RUN pip install --user --no-cache-dir -r requirements.txt

# # --- Stage 2: The Final Runtime ---
# FROM python:3.10-slim

# WORKDIR /app

# # Install only the runtime library needed for FAISS (much smaller than build-essential)
# RUN apt-get update && apt-get install -y \
#     libgomp1 \
#     && rm -rf /var/lib/apt/lists/*

# # Copy only the installed packages from the builder stage
# COPY --from=builder /root/.local /root/.local
# COPY . .

# # Set paths so Python can find the libraries
# ENV PATH=/root/.local/bin:$PATH
# ENV PYTHONUSERBASE=/root/.local

# EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]









