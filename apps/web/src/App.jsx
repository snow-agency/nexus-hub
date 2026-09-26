import LoginPage from './pages/LoginPage.jsx'
import { HomePage } from '../../../src/pages/home/HomePage.jsx'

export default function App() {
  return window.location.pathname === '/auth' ? <LoginPage /> : <HomePage />
}