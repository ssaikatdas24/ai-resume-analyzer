// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SessionPage from './pages/SessionPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <Link to="/" className="text-xl font-bold text-indigo-600">ResumeAnalyzer</Link>
              <Link to="/history" className="text-md font-medium text-gray-500 hover:text-gray-900">History</Link>
            </div>
          </div>
        </nav>
        <main className="py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;