import React, { useEffect, useState, useRef } from 'react'
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Box, TextField, MenuItem, Button } from '@mui/material'
import { fetchNotifications } from './api'
import NotificationList from './components/NotificationList'
import PriorityInbox from './components/PriorityInbox'

const TYPES = ['All', 'Event', 'Result', 'Placement']

export default function App() {
  const [tab, setTab] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState('All')
  const [authToken, setAuthToken] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [viewedIds, setViewedIds] = useState(new Set())
  const polling = useRef(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('viewedIds') || '[]')
    setViewedIds(new Set(stored))
    const t = localStorage.getItem('authToken') || ''
    setAuthToken(t)
  }, [])

  useEffect(() => {
    loadOnce()
    polling.current = setInterval(loadOnce, 5000)
    return () => clearInterval(polling.current)
  }, [])

  async function loadOnce() {
    try {
      setFetchError('')
      const data = await fetchNotifications({ limit: 100, token: authToken })
      setNotifications(prev => {
        const map = new Map(prev.map(p => [p.ID, p]))
        data.forEach(d => map.set(d.ID, d))
        return Array.from(map.values()).sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
      })
    } catch (e) {
      console.error(e)
      setFetchError(e.message)
    }
  }

  function handleMarkViewed(id) {
    setViewedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      localStorage.setItem('viewedIds', JSON.stringify(Array.from(next)))
      return next
    })
  }

  function saveToken() {
    localStorage.setItem('authToken', authToken || '')
    loadOnce()
  }

  function clearToken() {
    setAuthToken('')
    localStorage.removeItem('authToken')
    loadOnce()
  }

  const filtered = notifications.filter(n => typeFilter === 'All' ? true : n.Type === typeFilter)

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Notification App</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField select label="Type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} size="small">
            {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Top n" value={limit} onChange={e => setLimit(Number(e.target.value))} size="small" sx={{ width: 120 }} />
          <Button variant="contained" onClick={loadOnce}>Refresh</Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField label="Auth token (if required)" size="small" value={authToken} onChange={e => setAuthToken(e.target.value)} sx={{ flex: 1 }} />
          <Button variant="outlined" onClick={saveToken}>Save token</Button>
          <Button variant="text" onClick={clearToken}>Clear</Button>
        </Box>

        {fetchError && <Box sx={{ mt: 2 }}><Typography color="error">{fetchError}</Typography></Box>}

        <Box sx={{ mt: 2 }}>
          {tab === 0 && (
            <NotificationList items={filtered} onMarkViewed={handleMarkViewed} viewedIds={viewedIds} />
          )}
          {tab === 1 && (
            <PriorityInbox notifications={notifications} topN={limit} onMarkViewed={handleMarkViewed} viewedIds={viewedIds} />
          )}
        </Box>
      </Container>
    </div>
  )
}
