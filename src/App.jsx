import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Formations from './pages/Formations';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <CMSProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="formations" element={<Formations />} />
            <Route path="projects" element={<Projects />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </CMSProvider>
  );
}
