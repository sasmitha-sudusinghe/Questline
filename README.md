# Questline

Real life, gamified. Complete daily quests, earn XP, level up, and become the person you keep promising yourself you'll be.

## What it is

Questline turns your goals into a quest log. Instead of a to-do list that just sits there, you get:

- **Daily quests** — small, real-world tasks tied to the habits and goals you care about
- **XP and levels** — every completed quest moves you forward, with visible progress
- **Streaks** — momentum you can see, and don't want to break
- **Quest history** — a log of what you've actually done, not just what you planned to do

The goal isn't gimmicks. It's making consistency feel like progress instead of a chore.

## Features (MVP)

- [ ] Create, read, update, and delete quests (CRUD)
- [ ] Mark quests complete and earn XP
- [ ] Level-up system based on cumulative XP
- [ ] Daily quest reset / recurring quests
- [ ] Streak tracking per quest or overall
- [ ] Basic user accounts (so progress persists)

## Tech Stack

> Fill in once decided — placeholder below assumes a common web stack.

- **Frontend:** React
- **Backend:** Node.js / Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT-based sessions

## Data Model (draft)

**User** (`users` collection)
```js
{
  _id: ObjectId,
  username: String,
  passwordHash: String,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
}
```

**Quest** (`quests` collection)
```js
{
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User' },
  title: String,
  description: String,
  xpValue: Number,
  recurring: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now }
}
```

## Getting Started

```bash
# clone the repo
git clone https://github.com/your-username/questline.git
cd questline

# install dependencies
npm install

# set up environment variables
cp .env.example .env

# run the app
npm run dev
```

## API Endpoints (draft)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/quests` | List all quests for the current user |
| POST | `/quests` | Create a new quest |
| GET | `/quests/:id` | Get a single quest |
| PUT | `/quests/:id` | Update a quest |
| DELETE | `/quests/:id` | Delete a quest |
| POST | `/quests/:id/complete` | Mark a quest complete, award XP |

## Roadmap

- Quest difficulty tiers (Easy / Medium / Hard XP scaling)
- Achievements / badges
- Friend leaderboards
- Custom "character" or avatar that evolves with level

## License

MIT
