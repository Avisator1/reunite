import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ReuniteSignupForm from './pages/SignUp';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import MatchesPage from './pages/MatchesPage';
import RewardsPage from './pages/RewardsPage';
import FoundItemsPage from './pages/FoundItemsPage';
import LostItemsPage from './pages/LostItemsPage';
import ClaimsPage from './pages/ClaimsPage';
import QRCodesPage from './pages/QRCodesPage';
import QRCodeContact from './pages/QRCodeContact';
import ChatPage from './pages/ChatPage';
import About from './pages/About';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/signup' element={<ReuniteSignupForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/about' element={<About />} />
          <Route path='/qr/:code' element={<QRCodeContact />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/found' element={<FoundItemsPage />} />
          <Route path='/dashboard/lost' element={<LostItemsPage />} />
          <Route path='/dashboard/claims' element={<ClaimsPage />} />
          <Route path='/dashboard/qr-codes' element={<QRCodesPage />} />
          <Route path='/dashboard/matches' element={<MatchesPage />} />
          <Route path='/dashboard/rewards' element={<RewardsPage />} />
          <Route path='/dashboard/chat' element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;