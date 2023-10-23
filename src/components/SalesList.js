import React from 'react';

console.log("SalesList file loaded!");

function SalesList({ sales }) {
  console.log("SalesList is rendering");
  console.log("Sales prop:", sales);

    if (!Array.isArray(sales) || sales.length === 0) {
        return (
            <div className="sales-list">
                <h2>Recent Sales</h2>
                <p>No sales data available.</p>
            </div>
        );
    }

    return (
        <div className="sales-list">
            <h2>Recent Sales</h2>
            <ul className="sales-list">
                {sales.map(sale => (
                    <li className="sales-item" key={sale.id}>
                        {sale.sellerName} sold {sale.productName} for a total of ${sale.salesValue}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SalesList;

