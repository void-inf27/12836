import React, { useMemo } from 'react'
import NotificationList from './NotificationList'

function typeWeight(t) {
  if (t === 'Placement') return 3
  if (t === 'Result') return 2
  return 1
}

export default function PriorityInbox({ notifications = [], topN = 10, onMarkViewed, viewedIds }) {
  const scored = useMemo(() => {
    return notifications.map(n => {
      const ts = new Date(n.Timestamp).getTime()
      const w = typeWeight(n.Type)
      const score = w * 1e12 + ts
      return { ...n, score }
    }).sort((a, b) => b.score - a.score).slice(0, topN)
  }, [notifications, topN])

  return (
    <div>
      <NotificationList items={scored} onMarkViewed={onMarkViewed} viewedIds={viewedIds} />
    </div>
  )
}
