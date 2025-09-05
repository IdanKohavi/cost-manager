import React, { useEffect, useMemo, useState } from 'react'
import { openCostsDB } from '../lib/idb.module.js'
import { Paper, Stack, TextField, MenuItem, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

const currencies = ['USD','ILS','GBP','EURO']

export default function ReportsPage() {
  const now = new Date()
  const [db, setDb] = useState(null)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()+1)
  const [currency, setCurrency] = useState('USD')
  const [report, setReport] = useState(null)

  useEffect(() => { openCostsDB().then(setDb) }, [])

  useEffect(() => {
    if (!db) return
    db.getReport(year, month, currency).then(setReport)
  }, [db, year, month, currency])

  const months = useMemo(() => Array.from({length:12}, (_,i)=>i+1), [])

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Monthly Report</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField type="number" label="Year" value={year} onChange={e=>setYear(Number(e.target.value))} />
        <TextField select label="Month" value={month} onChange={e=>setMonth(Number(e.target.value))}>
          {months.map(m=> <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select label="Currency" value={currency} onChange={e=>setCurrency(e.target.value)}>
          {currencies.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Stack>
      {report && (
        <>
          <Typography sx={{ mb: 1 }}>Total: {report.total.total} {report.total.currency}</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sum</TableCell>
                <TableCell>Currency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.costs.map((c, idx)=>(
                <TableRow key={idx}>
                  <TableCell>{c.day}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>{c.description}</TableCell>
                  <TableCell>{c.sum}</TableCell>
                  <TableCell>{c.currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Paper>
  )
}
