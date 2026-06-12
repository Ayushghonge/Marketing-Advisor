import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WizardPage from './pages/WizardPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import PlatformPage from './pages/PlatformPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-wrapper container">
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/platform/:name" element={<PlatformPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
