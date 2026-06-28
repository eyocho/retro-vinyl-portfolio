import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import netlifyIdentity from 'netlify-identity-widget'
netlifyIdentity.on('init', user => {
  if (!user) {
    netlifyIdentity.on('login', () => {
      document.location.href = '/admin/'
    })
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
