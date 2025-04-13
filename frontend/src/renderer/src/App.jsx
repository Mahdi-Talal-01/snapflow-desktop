import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import EditImage from './pages/Editimage'
import Layout from './Layout'
import Auth from './pages/Auth'
function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without header */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected and layout-wrapped routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/edit-image" element={<EditImage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
