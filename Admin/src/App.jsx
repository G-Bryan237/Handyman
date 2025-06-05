import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { routes } from './routes/routes'
import ErrorBoundary from './components/ErrorBoundary';
import ServiceProviders from './pages/users/providers';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {routes.map((route, index) => (
            <Route 
              key={index} 
              path={route.path} 
              element={<route.element />} 
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
