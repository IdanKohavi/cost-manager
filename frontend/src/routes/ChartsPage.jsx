import React, { useEffect, useMemo, useState } from 'react'
import { openCostsDB } from '../lib/idb.module.js'
import { Paper, Stack, TextField, MenuItem, Typography, Divider } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const currencies = ['USD','ILS','GBP','EURO']

export default function ChartsPage() {
  const now = new Date()
  const [db, setDb] = useState(null)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()+1)
  const [currency, setCurrency] = useState('USD')
  const [monthlyReport, setMonthlyReport] = useState(null)
  const [yearlyData, setYearlyData] = useState([])
  const [rates, setRates] = useState({ USD:1, ILS:3.4, GBP:1.8, EURO:0.7 })
  const symbols = { USD:'$', ILS:'₪', GBP:'£', EURO:'€' }


  useEffect(() => { openCostsDB().then(setDb) }, [])
  useEffect(() => {
  if (!db) return
  ;(async () => {
    const r = await db.getRates?.()
    if (r) setRates(r)
  })()
}, [db])


  useEffect(() => {
    if (!db) return
    db.getReport(year, month, currency).then(setMonthlyReport)
  }, [db, year, month, currency])

  useEffect(() => {
    if (!db) return
    ;(async () => {
      const arr = []
      for (let m=1; m<=12; m++) {
        const rep = await db.getReport(year, m, currency)
        arr.push({ month: m, total: rep.total.total })
      }
      setYearlyData(arr)
    })()
  }, [db, year, currency])

  const months = useMemo(() => Array.from({length:12}, (_,i)=>i+1), [])

const pieData = useMemo(() => {
  if (!monthlyReport) return []
  const toUSD = (sum, cur) => Number(sum) / Number(rates[cur] || 1)
  const fromUSD = (usd, tgt) => Number(usd) * Number(rates[tgt] || 1)
  const agg = new Map()
  for (const item of monthlyReport.costs) {
    const usd = toUSD(item.sum, item.currency)
    const val = fromUSD(usd, currency)
    agg.set(item.category, Number((agg.get(item.category) || 0) + val))
  }
  return Array.from(agg, ([name, value]) => ({
    name,
    value: Number(value.toFixed(2))
  }))
}, [monthlyReport, currency, rates])


  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Charts</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField type="number" label="Year" value={year} onChange={e=>setYear(Number(e.target.value))} />
        <TextField select label="Month" value={month} onChange={e=>setMonth(Number(e.target.value))}>
          {months.map(m=> <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </TextField>
        <TextField select label="Currency (totals)" value={currency} onChange={e=>setCurrency(e.target.value)}>
          {currencies.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Stack>

      <Typography variant="subtitle1">Pie Chart — totals by category ({currency})</Typography>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={pieData} outerRadius={120} label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1">Bar Chart — total per month ({currency})</Typography>
      <div style={{ width: '100%', height: 360 }}>
        <ResponsiveContainer>
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name={`Total (${symbols[currency] || currency})`} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  )
}
