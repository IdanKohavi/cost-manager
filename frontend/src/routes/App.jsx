import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

function NavButton({ to, label }) {
  const loc = useLocation()
  const isActive = loc.pathname === to
  return (
    <Button
      component={Link}
      to={to}
      variant={isActive ? 'contained' : 'outlined'} // outlined so it's visible on the blue bar
      color="inherit"
      sx={{ ml: 1 }}
    >
      {label}
    </Button>
  )
}

export default function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Cost Manager
          </Typography>
          <NavButton to="/" label="Add Cost" />
          <NavButton to="/reports" label="Reports" />
          <NavButton to="/charts" label="Charts" />
          <NavButton to="/settings" label="Settings" />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 3, mb: 6 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
