import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Preview from './pages/Preview'
import PhotoDemo from './pages/PhotoDemo'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/photo-demo" element={<PhotoDemo />} />
      </Routes>
    </Layout>
  )
}

export default App
