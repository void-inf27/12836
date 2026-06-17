const BASE = process.env.REACT_APP_BASE_URL || 'http://4.224.186.213/evaluation-service/notifications'

export const CREDENTIALS = {
  email: process.env.REACT_APP_EMAIL || '',
  name: process.env.REACT_APP_NAME || '',
  rollNo: process.env.REACT_APP_ROLLNO || '',
  accessCode: process.env.REACT_APP_ACCESS_CODE || '',
  clientID: process.env.REACT_APP_CLIENT_ID || '',
  clientSecret: process.env.REACT_APP_CLIENT_SECRET || '',
}

export async function fetchNotifications({ limit = 50, page = 1, notification_type, token } = {}) {
  const params = new URLSearchParams()
  if (limit) params.set('limit', String(limit))
  if (page) params.set('page', String(page))
  if (notification_type) params.set('notification_type', notification_type)
  const q = params.toString()
  const url = BASE + (q ? '?' + q : '')
  const headers = {}
  const stored = typeof localStorage !== 'undefined' && localStorage.getItem('authToken')
  const t = token || stored
  if (t) {
    headers['Authorization'] = `Bearer ${t}`
  } else if (CREDENTIALS.clientID) {
    // If no token provided, include available credentials as headers.
    // Note: exposing client secrets in frontend is unsafe — prefer server-side usage.
    if (CREDENTIALS.clientID) headers['X-Client-ID'] = CREDENTIALS.clientID
    if (CREDENTIALS.clientSecret) headers['X-Client-Secret'] = CREDENTIALS.clientSecret
    if (CREDENTIALS.accessCode) headers['X-Access-Code'] = CREDENTIALS.accessCode
    if (CREDENTIALS.email) headers['X-Email'] = CREDENTIALS.email
    if (CREDENTIALS.name) headers['X-Name'] = CREDENTIALS.name
    if (CREDENTIALS.rollNo) headers['X-RollNo'] = CREDENTIALS.rollNo
  }
  const res = await fetch(url, { headers })
  if (!res.ok) {
    let text = ''
    try { text = await res.text() } catch (e) { text = res.statusText }
    throw new Error(`fetch failed ${res.status} ${text}`)
  }
  const data = await res.json()
  return data.notifications || []
}

