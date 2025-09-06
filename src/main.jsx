import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './routes/App.jsx'
import AddCostPage from './routes/AddCostPage.jsx'
import ReportsPage from './routes/ReportsPage.jsx'
import ChartsPage from './routes/ChartsPage.jsx'
import SettingsPage from './routes/SettingsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <AddCostPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/charts', element: <ChartsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)


