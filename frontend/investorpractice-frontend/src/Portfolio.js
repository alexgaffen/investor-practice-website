// src/Portfolio.js
import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import axios from 'axios';

function Portfolio() {
  const [userData, setUserData] = useState(null);
  const [stockPrices, setStockPrices] = useState({});
  const [sellQuantities, setSellQuantities] = useState({});

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          } else {
            console.log("User data does not exist");
          }
        });
        return () => unsubscribeSnapshot();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Poll for updated stock prices every 60 seconds whenever userData is available.
  useEffect(() => {
    let interval;
    if (userData && userData.portfolio && userData.portfolio.length > 0) {
      const fetchPrices = () => {
        userData.portfolio.forEach(async (stockItem) => {
          const symbol = stockItem.symbol;
          try {
            const response = await axios.get(`http://localhost:5000/api/quote`, {
              params: { symbol: symbol },
            });
            const currentPrice = response.data.c;
            setStockPrices((prevPrices) => ({
              ...prevPrices,
              [symbol]: currentPrice ? parseFloat(currentPrice).toFixed(2) : 'N/A',
            }));
          } catch (error) {
            console.error("Error fetching price for", symbol, error);
          }
        });
      };
      fetchPrices();
      interval = setInterval(fetchPrices, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userData]);

  const calculateValuations = () => {
    let currentValuation = 0;
    let originalValuation = 0;
    if (userData && userData.portfolio && userData.portfolio.length > 0) {
      userData.portfolio.forEach(stockItem => {
        const quantity = Number(stockItem.quantity) || 0;
        originalValuation += quantity * Number(stockItem.purchasePrice);
        const currentPriceStr = stockPrices[stockItem.symbol];
        const currentPrice = (currentPriceStr && currentPriceStr !== 'N/A') ? parseFloat(currentPriceStr) : 0;
        currentValuation += quantity * currentPrice;
      });
    }
    return { currentValuation, originalValuation };
  };

  const { currentValuation, originalValuation } = calculateValuations();
  const netWorth = (userData ? Number(userData.balance) : 0) + currentValuation;

  // Function to handle selling a specified number of shares from a portfolio entry
  const sellStock = async (entryIndex, sellQuantity) => {
    if (!userData) return;
    const stockItem = userData.portfolio[entryIndex];
    if (!stockItem) return;
    const availableQuantity = Number(stockItem.quantity);
    if (sellQuantity > availableQuantity) {
      alert("You cannot sell more shares than you own in this entry.");
      return;
    }
    const currentPriceStr = stockPrices[stockItem.symbol];
    if (!currentPriceStr || currentPriceStr === 'N/A') {
      alert("Current price not available");
      return;
    }
    const currentPrice = parseFloat(currentPriceStr);
    const saleValue = sellQuantity * currentPrice;
    const newBalance = Number(userData.balance) + saleValue;

    let updatedPortfolio = [...userData.portfolio];
    if (sellQuantity === availableQuantity) {
      updatedPortfolio.splice(entryIndex, 1);
    } else {
      updatedPortfolio[entryIndex] = {
        ...stockItem,
        quantity: availableQuantity - sellQuantity,
      };
    }
    const userRef = doc(firestore, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        balance: newBalance,
        portfolio: updatedPortfolio,
      });
      alert(`Sold ${sellQuantity} share(s) of ${stockItem.symbol} for $${saleValue.toFixed(2)}`);
    } catch (error) {
      console.error("Error selling stock:", error);
    }
  };

  if (!userData) return <p>Loading portfolio...</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>
      <p>Savings Account: ${Number(userData.balance).toFixed(2)}</p>
      <p>Current Stock Valuation: ${currentValuation.toFixed(2)}</p>
      <p>Original Stock Valuation: ${originalValuation.toFixed(2)}</p>
      <p><strong>Net Worth: ${netWorth.toFixed(2)}</strong></p>

      {userData.portfolio && userData.portfolio.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Stock Symbol</th>
              <th>Purchase Date</th>
              <th>Stock Purchase Price</th>
              <th>Quantity</th>
              <th>Current Stock Price</th>
              <th>Sell Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.portfolio.map((stockItem, index) => (
              <tr key={index}>
                <td>{stockItem.symbol}</td>
                <td>{new Date(stockItem.purchaseDate).toLocaleString()}</td>
                <td>${Number(stockItem.purchasePrice).toFixed(2)}</td>
                <td>{stockItem.quantity}</td>
                <td>
                  {stockPrices[stockItem.symbol]
                    ? `$${stockPrices[stockItem.symbol]}`
                    : 'Loading...'}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={stockItem.quantity}
                    value={sellQuantities[index] || 1}
                    onChange={(e) =>
                      setSellQuantities(prev => ({ ...prev, [index]: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <button onClick={() => sellStock(index, Number(sellQuantities[index] || 1))}>
                    Sell Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stocks in portfolio.</p>
      )}
    </div>
  );
}

export default Portfolio;