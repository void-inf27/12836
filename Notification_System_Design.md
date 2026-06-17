# Stage 1

Overview

This small React app fetches notifications from the provided API and shows two views: All Notifications and Priority Inbox. Priority is computed by combining a simple type weight and recency. Viewed notification IDs are stored in localStorage so the UI can distinguish new vs viewed.

Priority algorithm

- Type weights: Placement=3, Result=2, Event=1
- Score = typeWeight * 1e12 + timestamp_ms
- Sorting by score descending produces a list where type is primary and recency breaks ties.

Trade-offs

- Simplicity chosen for speed: scoring uses a linear combination (weight dominates) so priority reflects type more than recency. This is easy to explain and implement.
- Polling every 5 seconds keeps the UI up-to-date. In production a websocket or push system would be better.
- localStorage is used to persist viewed state per browser only.

Files

- src/api.js: fetch helper
- src/App.js: main UI, polling, filters
- src/components/NotificationList.js: renders lists
- src/components/PriorityInbox.js: computes top-n

How to run

Install dependencies and run:

```
npm install
npm start
```
