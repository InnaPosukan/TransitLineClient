import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreateOrder from './pages/CreateOrder';
import AdminPage from './pages/AdminPage';
import DriverPage from './pages/DriverPage';
import OrderDetailPageForDriver from './pages/OrderDetailPageForDriver'
import UserOrders from './pages/UserOrders';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/CreateOrder" element={<CreateOrder/>} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/driver" element={<DriverPage/>} />
          <Route path="/order/:orderId" element={<OrderDetailPageForDriver />} />
          <Route path="/UserOrders" element={<UserOrders />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
