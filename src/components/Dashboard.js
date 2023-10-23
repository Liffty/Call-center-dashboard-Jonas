
import React, { useState, useEffect } from 'react';
import { users } from './users';
import { products } from './products';
import SalesList from './SalesList';
import TopSellers from './TopSellers';
import './Dashboard.css';


function Dashboard() {
  const [data, setData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topSellersData, setTopSellersData] = useState([]);
  const [showTopSellers, setShowTopSellers] = useState(true); // Start with top sellers

      useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/sales');
                const fetchedData = await response.json();
                console.log("Fetched data:", fetchedData);
                console.log(fetchedData);
                setData(fetchedData);
                setSalesData(fetchedData);
                const topSellers = computeTopSellers(users, products, fetchedData);
                setTopSellersData(topSellers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
        const intervalId = setInterval(fetchData, 30000);  // Fetch data every 30 seconds

        return () => clearInterval(intervalId);  // Cleanup on component unmount
    }, []);

    useEffect(() => {
        const displayDuration = showTopSellers ? 60000 : 30000; // 1 minute for top sellers, 0.5 minute for recent sales

        const timeoutId = setTimeout(() => {
            setShowTopSellers(!showTopSellers); // Switch between top sellers and recent sales
        }, displayDuration);

        // Cleanup function to clear the timeout when component is unmounted
        return () => clearTimeout(timeoutId);
    }, [showTopSellers]); // Dependency array to rerun effect when `showTopSellers` changes

    useEffect(() => {
      // Initialize WebSocket connection
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
          console.log('Connected to the WebSocket');
      };

      ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'NEW_SALE') {
              // Update salesData state with the new sale data
              setSalesData((prevSales) => [...prevSales, message.data]);
          }
      };

      ws.onclose = () => {
          console.log('Disconnected from the WebSocket');
      };

      // Cleanup: close the WebSocket connection when the component is unmounted
      return () => {
          ws.close();
      };
  }, []);

  const [salesWithDetails, setSalesWithDetails] = useState([]);

  useEffect(() => {
    if (data && data.users && data.products) {
//  if (data && data.users && data.products) {
        const salesWithDetails = data.events.map(event => {
//      const salesWithDetails = data.events.map(event => {
            const product = data.products.find(product => product.id === event.productId);
            const user = data.users.find(u => u.id === event.userId);
            const salesValue = product ? (product.unitprice * event.duration).toFixed(2) : 0;

            return {
                ...event,
                productName: product ? product.name : 'Unknown Product',
                sellerName: user ? user.name : 'Unknown Seller',
                salesValue: salesValue
            };
        });


        console.log('salesWithDetails:', salesWithDetails);
        console.log('Processed salesWithDetails:', salesWithDetails);
        setSalesData(salesWithDetails);
    } else {
        console.log('Data not available or incomplete:', data);
    }
}, [data]);


  // Calculate and set the top sellers data here based on the events
  function computeTopSellers(users, products, events) {
    if (!Array.isArray(users) || !Array.isArray(products) || !Array.isArray(events)) {
        return [];  // Return an empty array if the data isn't valid
    }
  
    // Create a mapping of product IDs to their prices for quick lookup
    const productPriceMap = products.reduce((acc, product) => {
        acc[product.id] = product.unitprice;
        return acc;
    }, {});
  
    // Compute total sales value for each user
    const userSales = events.reduce((acc, event) => {
        const userId = event.userId;
        const productPrice = productPriceMap[event.productId] * 100;
        const saleValue = event.duration * productPrice;
  
        acc[userId] = (acc[userId] || 0) + saleValue;
  
        return acc;
    }, {});

    // Convert user sales to an array and sort by sales
    const sortedUsers = users
    .map(user => ({
        id: user.id,
        name: user.name,
        sales: (userSales[user.id] || 0) / 100
    }))
    .sort((a, b) => b.sales - a.sales); // sort in descending order
    
return sortedUsers;
}

console.log('salesData:', salesData);
console.log('topSellersData:', topSellersData);
console.log("About to render SalesList with data:", salesData);

  return (
    <div className="dashboard">
        <h1>Call Center Dashboard</h1>
        {showTopSellers ? <TopSellers sellers={topSellersData} /> : Array.isArray(salesWithDetails) && salesWithDetails.length > 0 ? <SalesList sales={salesWithDetails} /> : <p>No sales data available.</p>}
    </div>
  );

  async function sendDataToBackend(salesData) {
    try {
        const response = await fetch('http://localhost:5000/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(salesData)
        });

        const responseData = await response.text();
        console.log(responseData);  // Expected to log: 'Data received'
    } catch (error) {
        console.error('Error sending data:', error);
    }
}
}




export default Dashboard;

