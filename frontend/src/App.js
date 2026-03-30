import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Layout/Navbar.js';
import Home from './pages/Home.js';
import AddUser from './pages/AddUser.js';
import Login from './pages/Login.js';
import ProtectedRoute from './components/ProtectedRoute.js';


function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={
            <ProtectedRoute>
              <Navbar />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/adduser" element={<AddUser />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
