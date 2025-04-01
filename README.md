<div align="center">

<h3 align="center">Investor Practice Website</h3>

  <p align="center">
    A web application for practicing investment strategies with virtual money.
    <br />
     <a href="https://github.com/alexgaffen/investor-practice-website">github.com/alexgaffen/investor-practice-website</a>
  </p>
</div>

## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

The Investor Practice Website is a full-stack application designed to simulate a stock market trading environment. Users can sign in with their Google account, search for stocks, buy and sell stocks, and track their portfolio performance. The application consists of a React frontend, a Node.js backend, and a C++ service for algorithmic analysis (currently provides a dummy trading signal). Firebase is used for authentication and data storage.

### Key Features

- **Google Authentication:** Securely sign in using Google accounts.
- **Stock Search:** Search for stocks using the Finnhub API via the backend.
- **Real-time Stock Quotes:** Get real-time stock quotes from Finnhub API.
- **Virtual Portfolio:** Buy and sell stocks with virtual money and track portfolio performance.
- **Account Management:** Delete account functionality.
- **Trading Signal:** C++ service provides a basic trading signal.

## Architecture

The project follows a microservices architecture, with three main components:

- **Frontend:** A React application (`frontend/investorpractice-frontend`) that provides the user interface. It interacts with the backend API to fetch stock data, manage user authentication, and handle portfolio transactions.
- **Backend:** A Node.js server (`backend/server.js`) that acts as a proxy to the Finnhub API. It provides endpoints for stock search and quote retrieval. It also handles user data management in Firebase.
- **C++ Service:** A simple C++ service (`cpp-algos/src/main.cpp`) that exposes an endpoint for algorithmic analysis. Currently, it returns a dummy "BUY" signal.

The services are containerized using Docker, and Docker Compose is used to orchestrate the application. Firebase is used for user authentication and data storage.

## Getting Started

To run the Investor Practice Website locally, you need to have Docker and Docker Compose installed.

### Prerequisites

- Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- Docker Compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/alexgaffen/investor-practice-website.git
   cd investor-practice-website
   ```

2. Create a `.env` file in the `backend` directory and add your Finnhub API key:
   ```
   FINNHUB_API_KEY=YOUR_FINNHUB_API_KEY
   ```

3. Run Docker Compose to build and start the services:
   ```sh
   docker-compose up --build
   ```

4. Access the application in your browser at `http://localhost`.
