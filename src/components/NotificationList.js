import React from 'react'
import { List, ListItem, ListItemText, Chip, Button } from '@mui/material'

function typeColor(type) {
  if (type === 'Placement') return 'primary'
  if (type === 'Result') return 'success'
  return 'default'
}

export default function NotificationList({ items = [], onMarkViewed, viewedIds = new Set() }) {
  return (
    <List>
      {items.map(n => (
        <ListItem key={n.ID} divider secondaryAction={
          <Button size="small" onClick={() => onMarkViewed(n.ID)}>
            {viewedIds.has(n.ID) ? 'Viewed' : 'Mark viewed'}
          </Button>
        }>
          <ListItemText primary={n.Message} secondary={n.Timestamp} />
          <Chip label={n.Type} color={typeColor(n.Type)} size="small" />
        </ListItem>
      ))}
    </List>
  )
}
