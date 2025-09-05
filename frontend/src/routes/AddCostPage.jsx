import React, { useEffect, useState } from 'react'
import { openCostsDB } from '../lib/idb.module.js'
import { TextField, MenuItem, Button, Stack, Paper, Typography } from '@mui/material'

const currencies = ['USD','ILS','GBP','EURO']

export default function AddCostPage() {
  const [db, setDb] = useState(null)
  const [form, setForm] = useState({ sum: '', currency: 'USD', category: '', description: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    openCostsDB().then(setDb)
  }, [])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!db) return
    if (!form.sum || !form.currency || !form.category) {
      setMsg('Please fill sum, currency and category.')
      return
    }
    await db.addCost({ ...form, sum: Number(form.sum) })
    setMsg('Cost item added.')
    setForm({ sum: '', currency: 'USD', category: '', description: '' })
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Add Cost</Typography>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField name="sum" label="Sum" type="number" value={form.sum} onChange={onChange} required />
          <TextField select name="currency" label="Currency" value={form.currency} onChange={onChange}>
            {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField name="category" label="Category" value={form.category} onChange={onChange} required />
          <TextField name="description" label="Description" value={form.description} onChange={onChange} />
          <Button type="submit" variant="contained">Add</Button>
          <Typography variant="body2" color="success.main">{msg}</Typography>
        </Stack>
      </form>
    </Paper>
  )
}
