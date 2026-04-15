import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './layouts/register';
import Login from './layouts/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
