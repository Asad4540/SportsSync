import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Layout/Navbar.js';
import Home from './pages/Home.js';
import AddUser from './pages/AddUser.js';


function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route element={<Navbar />}>
            <Route path="/" element={<Home />} />
            <Route path="/adduser" element={<AddUser />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
