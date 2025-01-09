import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SomeOtherComponent from './components/SomeOtherComponent'; // Example of existing import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/some-other-route" element={<SomeOtherComponent />} /> {/* Example of existing route */}
      </Routes>
    </Router>
  );
}

export default App;
