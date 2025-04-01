// src/StockSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import { auth, firestore } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function StockSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Handle searching stocks using our backend API
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/search`, {
        params: {
          query: query,
        },
      });
      console.log("Backend search response:", response.data);
      const matches = response.data.result || [];
      setResults(matches);
    } catch (error) {
      console.error("Error searching for stocks:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuantityChange = (symbol, value) => {
    setQuantities(prev => ({ ...prev, [symbol]: value }));
  };

  // Buy a stock using our backend for the quote
  const buyStock = async (stock) => {
    try {
      const symbol = stock.symbol;
      const quantity = parseInt(quantities[symbol] || '1', 10);
      if (!symbol || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity");
        return;
      }
      
      // Get current price using our backend API for quotes
      const quoteResponse = await axios.get(`http://localhost:5000/api/quote`, {
        params: {
          symbol: symbol,
        },
      });
      const currentPrice = quoteResponse.data.c;
      if (!currentPrice || currentPrice === 0) {
        alert("Unable to fetch current price for " + symbol);
        return;
      }
      const cost = currentPrice * quantity;

      const user = auth.currentUser;
      if (!user) {
        alert("User not authenticated");
        return;
      }
      const userRef = doc(firestore, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        alert("User data not found");
        return;
      }
      const userData = snapshot.data();
      if (userData.balance < cost) {
        alert("Insufficient balance");
        return;
      }
      const newBalance = userData.balance - cost;

      // Check if a purchase was made within the last 10 minutes for the same stock
      const now = new Date();
      const recentPurchase = userData.portfolio && userData.portfolio.find(item =>
        item.symbol === symbol && (now - new Date(item.purchaseDate)) < 10 * 60 * 1000
      );
      if (recentPurchase) {
        alert("You cannot buy the same stock again within 10 minutes.");
        return;
      }

      const newStockEntry = {
        symbol: symbol,
        purchaseDate: now.toISOString(),
        purchasePrice: currentPrice,
        quantity: quantity,
      };

      const updatedPortfolio = userData.portfolio ? [...userData.portfolio, newStockEntry] : [newStockEntry];

      await updateDoc(userRef, {
        balance: newBalance,
        portfolio: updatedPortfolio,
      });

      alert(`Bought ${quantity} share(s) of ${symbol} at $${currentPrice.toFixed(2)} per share (Total cost: $${cost.toFixed(2)})`);
    } catch (error) {
      console.error("Error buying stock:", error.message);
      alert("Error buying stock: " + error.message);
    }
  };

  return (
    <div>
      <h2>Stock Search & Buy</h2>
      <input
        type="text"
        placeholder="Search for stocks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSearch}>Search</button>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '10px' }}>
        {results.length > 0 ? (
          results.map((stock, index) => (
            <div key={index} style={{ border: "1px solid gray", margin: "8px", padding: "8px" }}>
              <p>
                <strong>{stock.symbol}</strong> - {stock.description}
              </p>
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantities[stock.symbol] || 1}
                  onChange={(e) => handleQuantityChange(stock.symbol, e.target.value)}
                />
              </label>
              <button onClick={() => buyStock(stock)}>Buy Stock</button>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default StockSearch;