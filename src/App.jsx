import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CekPage from './pages/Cek'
import LoginPage from "./pages/LoginPage";
import EditPage from "./pages/EditPage";
import ProtectedGeneratePage from "./pages/ProtectedGeneratePage";
import RudTable from "./pages/rud";
import FormPage from './pages/Form'
import PeraturanPage from './pages/Peraturan'

export default function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<CekPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/peraturan" element={<PeraturanPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/generate" element={<ProtectedGeneratePage />} />
          <Route path="/rud" element={<RudTable />} />
        </Routes>
      </div>
    </Router>
  )
}
