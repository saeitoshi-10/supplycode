import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import MilestoneBoard from './pages/Meeting';
import Signup from './pages/signup';
import ProjectForm from './pages/projectform';
import CreateFeaturePage from './pages/CreateFeature';
import ProjectDashboard from './pages/listprojects';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/' element={<Home />} />
          <Route path='/milestone' element={<MilestoneBoard />} /> 
          <Route path='/signup' element={<Signup />} />
          <Route path='/create-project' element={<ProjectForm />} />
          <Route path='/createfeature' element={<CreateFeaturePage />} />
          <Route path='/dashboard' element={<ProjectDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}