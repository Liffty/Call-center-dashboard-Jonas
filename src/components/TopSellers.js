import React from 'react';

function TopSellers({ sellers }) {
    if (!sellers) {
        return <div>Error: Sellers data is missing</div>;
    }

  return (
    <div className="top-sellers">
      <h2>Top Sellers</h2>
      <ul className="top-sellers-list">
        {sellers.map(seller => (
          <li className="sales-item" key={seller.id}>
            {seller.name}: ${seller.sales.toFixed(2)}
          </li>
        ))}
      </ul>
      {sellers.length === 0 && <p>No top sellers data yet!</p>}
    </div>
  );
}

export default TopSellers;
