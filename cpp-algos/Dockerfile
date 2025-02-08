FROM ubuntu:20.04

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app

# Build the application
RUN mkdir build && cd build && cmake .. && make

# Expose the port the service listens on
EXPOSE 8080

# Run the service
CMD ["./build/cpp_service"]