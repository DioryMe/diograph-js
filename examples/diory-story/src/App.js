import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import DioryStoryRoute from './DioryStoryRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/story/:storyId" element={<DioryStoryRoute />} />
        <Route path="/" element={<DioryStoryRoute />} />
      </Routes>
    </Router>
  )
}

export default App
