import { Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import ResultsPage from './pages/ResultsPage';
import OneWayPage from './pages/OneWayPage';
import RoundTripPage from './pages/RoundTrip';

function App() {
  return (
    <div>

<div>
      <Header />
      {/* Other components go here */}
    </div>


      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/oneway" element={<OneWayPage />} />
        <Route path="/roundtrip" element={<RoundTripPage />} />
      </Routes>
    </div>
  );
}

export default App;
