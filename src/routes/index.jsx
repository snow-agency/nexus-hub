import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../pages/home/HomePage.jsx'

export const router = createBrowserRouter([
  { path: '*', element: <HomePage /> },
])