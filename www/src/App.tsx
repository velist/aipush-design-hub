import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './styles/globals.css'

function App() {
  const basename = process.env.NODE_ENV === 'production' ? '/aipush-design-hub' : ''
  
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App