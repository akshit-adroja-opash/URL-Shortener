import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Register from './layouts/register';
import Login from './layouts/login';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<h2>Welcome to URL Shortener</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
