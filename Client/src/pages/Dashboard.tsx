import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
    };
    loadData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    const price = priceRef.current?.value;
    const imageUrl = imageRef.current?.value;
    const description = descRef.current?.value;

    if (!title || !price || !imageUrl || !description) return;

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price: Number(price), imageUrl, description })
      });

      if (res.ok) {
        fetchProducts();
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="p-5 font-sans bg-gray-50 min-h-screen">
      <Navbar showcart={false} />
      
      <div className="flex justify-between items-center mb-5 pt-5">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Fuzz Mart - Admin Dashboard</h2>
      </div>
      
      <form onSubmit={handleAddProduct} className="mb-8 flex gap-3 flex-wrap bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <input ref={titleRef} type="text" placeholder="Product Title" className="p-2 rounded border border-gray-300 focus:outline-emerald-500" required />
        <input ref={priceRef} type="number" placeholder="Price ($)" className="p-2 rounded border border-gray-300 focus:outline-emerald-500" required />
        <input ref={imageRef} type="text" placeholder="Image URL" className="p-2 rounded border border-gray-300 focus:outline-emerald-500" required />
        <input ref={descRef} type="text" placeholder="Short Description" className="p-2 rounded border border-gray-300 focus:outline-emerald-500 flex-1" required />
        <button type="submit" className="bg-emerald-600 text-white border-none px-5 py-2 rounded font-bold cursor-pointer hover:bg-emerald-700 transition active:scale-95">
          Add Product
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Products</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(product => (
          <div key={product._id} className="border border-gray-200 p-4 rounded-xl text-center bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between">
            <div>
              <img src={product.imageUrl} alt={product.title} className="w-full h-44 object-contain mb-3" />
              <h4 className="my-2 font-bold text-lg text-gray-800 line-clamp-1">{product.title}</h4>
              <p className="text-sm text-gray-500 h-10 overflow-hidden mb-3 line-clamp-2">{product.description}</p>
            </div>
            <div>
              <p className="font-extrabold text-xl text-emerald-600 mb-3">${product.price}</p>
              <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white border-none p-2 rounded-lg cursor-pointer w-full font-bold hover:bg-red-600 transition active:scale-95">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}