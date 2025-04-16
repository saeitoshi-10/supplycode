import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import MilestoneBoard from './pages/Meeting';
import Login from './pages/Login';
<<<<<<< HEAD
import ProjectForm from './pages/projectform';
=======
import CreateFeaturePage from './pages/CreateFeature';
>>>>>>> 01b7820 (issue creation for the milestone)

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
          <Route path='/login' element={<Login />} />
<<<<<<< HEAD
          <Route path='/create-project' element={<ProjectForm />} />
=======
          <Route path='/createfeature' element={<CreateFeaturePage />} />
>>>>>>> 01b7820 (issue creation for the milestone)
        </Routes>
      </Layout>
    </Router>
  );
}