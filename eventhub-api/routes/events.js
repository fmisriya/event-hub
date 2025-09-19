const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const eventsFile = path.join(__dirname, '../data/events.json');

// Helper: Read events.json
function readEvents() {
  try {
    const data = fs.readFileSync(eventsFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: Write to events.json
function writeEvents(events) {
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
}

// POST /api/events - Create new event
router.post('/', (req, res) => {
  let { title, description = '', date, location, maxAttendees } = req.body;

  if (!title || !date || !location || !maxAttendees) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  maxAttendees = parseInt(maxAttendees, 10);
  if (isNaN(maxAttendees) || maxAttendees <= 0) {
    return res.status(400).json({ error: 'maxAttendees must be a positive integer' });
  }

  const events = readEvents();

  const newEvent = {
    eventId: `EVT-${Date.now()}`,  // ✅ fixed template string
    title,
    description,
    date,
    location,
    maxAttendees,
    currentAttendees: 0,
    status: 'upcoming'
  };

  events.push(newEvent);
  writeEvents(events);

  res.status(201).json(newEvent);
});

// GET /api/events - Get all events
router.get('/', (req, res) => {
  const events = readEvents();
  res.json(events);
});

module.exports = router;
