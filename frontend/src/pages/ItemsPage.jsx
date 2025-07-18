// import React, { useEffect, useState } from 'react';
// import axios from '../utils/axios';
// import ItemCard from '../components/ItemCard';
// import ItemModal from '../components/ItemModal';

// const ItemsPage = () => {
//   const [items, setItems] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [query, setQuery] = useState('');
//   const [category, setCategory] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);

//   useEffect(() => {
//     axios.get('/items')
//       .then(res => {
//         setItems(res.data);
//         setFiltered(res.data);
//       });
//   }, []);

//   const handleSearch = () => {
//     const q = query.toLowerCase();

//     const results = items.filter(i =>
//       i.name.toLowerCase().includes(q) &&
//       (!category || i.category === category) &&
//       (!maxPrice || i.pricePerDay <= parseFloat(maxPrice))
//     );

//     setFiltered(results);
//   };

//   return (
//     <div className="bg-[#FDFDFD] min-h-screen px-6 py-8">
//       <h1 className="text-3xl font-bold text-center mb-6">Explore Items</h1>

//       {/* Search + Filters */}
//       <div className="flex flex-wrap gap-4 justify-center mb-8">
//         <input
//           type="text"
//           placeholder="Search item..."
//           className="border p-2 rounded w-64"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />

//         <select
//           className="border p-2 rounded"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         >
//           <option value="">All Categories</option>
//           <option value="electronics">Electronics</option>
//           <option value="photography">Photography</option>
//           <option value="cameras">Cameras</option>
//           <option value="accessories">Accessories</option>
//           <option value="books">Books</option>
//           <option value="furniture">Furniture</option>
//           <option value="clothing">Clothing</option>
//         </select>

//         <input
//           type="number"
//           placeholder="Max Rs/day"
//           className="border p-2 rounded w-32"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//         />

//         <button
//           onClick={handleSearch}
//           className="bg-[#D30C7B] text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//       </div>

//       {/* Items Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
//         {filtered.length > 0 ? (
//           filtered.map(item => (
//             <ItemCard key={item._id} item={item} onClick={() => setSelectedItem(item)} />
//           ))
//         ) : (
//           <p className="text-center col-span-3 text-gray-500">No items found matching your criteria.</p>
//         )}
//       </div>

//       {/* Modal */}
//       {selectedItem && (
//         <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
//       )}
//     </div>
//   );
// };

// export default ItemsPage;








import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import Navbar from '../components/Navbar';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [town, setTown] = useState('');
  const [townList, setTownList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    axios.get('/items')
      .then(res => {
        const items = res.data;
        setItems(items);
        setFiltered(items);

        // Extract unique towns from owner info
        const towns = [...new Set(items.map(i => i.owner?.town).filter(Boolean))];
        setTownList(towns);
      });
  }, []);

  const handleSearch = () => {
    const q = query.toLowerCase();

    const results = items.filter(i =>
      i.name.toLowerCase().includes(q) &&
      (!category || i.category === category) &&
      (!maxPrice || i.pricePerDay <= parseFloat(maxPrice)) &&
      (!town || i.owner?.town === town)
    );

    setFiltered(results);
  };

  return (
    <>
    <Navbar />
    <div className="bg-[#FDFDFD] min-h-screen px-6 py-8 mt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Explore Items</h1>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search item..."
          className="border p-2 rounded w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          
          <option value="photography">Photography</option>
          <option value="cameras">Cameras</option>
          <option value="accessories">Accessories</option>
          <option value="books">Audio</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="jewels">Jewels</option>
        </select>

        <input
          type="number"
          placeholder="Max Rs/day"
          className="border p-2 rounded w-32"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        {townList.length > 0 && (
          <select
            className="border p-2 rounded"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          >
            <option value="">All Towns</option>
            {townList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}

        <button
          onClick={handleSearch}
          className="bg-[#D30C7B] text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <ItemCard key={item._id} item={item} onClick={() => setSelectedItem(item)} />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No items found matching your criteria.</p>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
    </>
  );
};

export default ItemsPage;
