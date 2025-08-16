import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Products from "./pages/Products.jsx";
import Pricing from "./pages/Pricing.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from './pages/AppLayout.jsx';
import Product from './pages/Pricing.jsx';

const App = () => {
  return (
      <div>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product" element={<Product />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/app" element={<AppLayout />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
      </div>

  )
};

export default App;
