import { useState } from 'react'

import LandingPage from './Pages/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import About from './Pages/About/About'
import Track from './Pages/Track/Track'

import BestSeller from './Pages/BestSeller/BestSeller'
import Shop from './Pages/Shop/Shop'
import Contact from './Pages/Contact/Contact'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pages/about-us" element={<About />} />
          <Route path="/pages/contact" element={<Contact />} />
          <Route path="/app/parcelpanel" element={<Track />} />
          <Route path="/products/glowbeam-sculpt-brief" element={<Shop />} />
          <Route path="/collections/best-sellers" element={<BestSeller />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
