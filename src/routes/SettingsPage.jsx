import React, { useEffect, useState } from 'react'
import { openCostsDB } from '../lib/idb.module.js'
import { Paper, Stack, TextField, Button, Typography } from '@mui/material'

export default function SettingsPage() {
  const [db, setDb] = useState(null)
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    openCostsDB().then(async (dbi) => {
      setDb(dbi)
      const rates = await dbi.getRates()
      if (rates) setMsg('Rates already stored.')
    })
  }, [])

  async function fetchAndSave() {
    try {
      const res = await fetch(url)
      const json = await res.json()
      await db.saveRates(url, json)
      setMsg('Rates saved.')
    } catch (e) {
      setMsg('Failed fetching rates. Ensure the URL returns the required JSON.')
    }
  }

  return (
    <Paper sx={{ p:3 }}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Stack spacing={2} direction="row">
        <TextField fullWidth label="Exchange Rates URL" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder='https://yourdomain.com/rates.json' />
        <Button variant="contained" onClick={fetchAndSave} disabled={!db || !url}>Fetch & Save</Button>
      </Stack>
      <Typography sx={{ mt:2 }} color="success.main">{msg}</Typography>
      <Typography sx={{ mt:2 }} variant="body2">
        Expected JSON: {"{"}"USD":1,"GBP":1.8,"EURO":0.7,"ILS":3.4{"}"}
      </Typography>
    </Paper>
  )
}
