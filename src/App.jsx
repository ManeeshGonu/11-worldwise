import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Pricing from "./pages/Pricing.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import AppLayout from './pages/AppLayout.jsx';
import Product from './pages/Product.jsx';
import Login from './pages/Login.jsx';
import CityList from './components/CityList.jsx';
import CountryList from './components/CountryList.jsx';
import City from './components/City.jsx';
import Form from "./components/Form.jsx";
import {CitiesContext} from './contexts/CitiesContext.jsx';
import { AuthContext } from './contexts/FakeAuthContext.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';

const App = () => {


  return (
    <AuthContext>
      <CitiesContext>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={ <ProtectedRoute><AppLayout /></ProtectedRoute> } >
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path='cities' element={<CityList />} />
                  <Route path='countries' element={<CountryList />} />
                  <Route path='cities/:id' element={<City/>} />
                  <Route path='form' element={<Form/>} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
          </BrowserRouter>
      </CitiesContext>
    </AuthContext>

  )
};

export default App;
