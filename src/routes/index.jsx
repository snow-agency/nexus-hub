import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/home/HomePage.jsx'
import { LoginPage } from '../pages/auth/LoginPage.jsx'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <LoginPage /> },
  { path: '*', element: <HomePage /> },
])