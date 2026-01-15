# API Contract

## 🔐 Authentication APIs

### Register
**POST** `/auth/register`

Request:
```json
{
  "email": "user@mail.com",
  "password": "StrongPassword123"
}
```
Response:
```json
{
  "userId": "uuid",
  "email": "user@mail.com"
}
```

### Login
**POST** `/auth/login`

Response:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "email": "user@mail.com"
  }
}
```
*🔒 JWT will contain userId.*

---

## 👥 Group & Participant APIs

### Create Group
**POST** `/groups`

Request:
```json
{
  "name": "Goa Trip",
  "participants": [
    { "name": "You" },
    { "name": "Alice", "color": "#FF5733" }
  ]
}
```
**Rules:**
- Creator is auto-added as participant
- Max 4 participants total

### Edit Group
**PUT** `/groups/:groupId`

Request:
```json
{
  "name": "Goa Trip 2026"
}
```

### Delete Group
**DELETE** `/groups/:groupId`
- ✔ Cascade delete enforced at DB level

### Add Participant
**POST** `/groups/:groupId/participants`

Request:
```json
{
  "name": "Bob",
  "color": "#33C1FF"
}
```

### Edit Participant
**PUT** `/participants/:participantId`

Request:
```json
{
  "name": "Bobby"
}
```

### Remove Participant
**DELETE** `/participants/:participantId`

**Rule:**
- Cannot remove if participant is payer in any expense
- OR must reassign payer first

---

## 💸 Expense APIs

### Add Expense
**POST** `/groups/:groupId/expenses`

**Equal Split** Request:
```json
{
  "amount": 1200,
  "description": "Dinner",
  "date": "2026-01-15",
  "payerParticipantId": "uuid",
  "splitMode": "EQUAL",
  "splits": [
    { "participantId": "uuid" },
    { "participantId": "uuid" }
  ]
}
```

**Custom Amount** Request:
```json
{
  "splitMode": "CUSTOM",
  "splits": [
    { "participantId": "uuid", "amount": 700 },
    { "participantId": "uuid", "amount": 500 }
  ]
}
```

**Percentage** Request:
```json
{
  "splitMode": "PERCENTAGE",
  "splits": [
    { "participantId": "uuid", "percentage": 60 },
    { "participantId": "uuid", "percentage": 40 }
  ]
}
```

🔥 **Rule:** Backend converts all splits → final amounts. Stores only amount.

### Edit Expense
**PUT** `/expenses/:expenseId`
- ✔ Old splits deleted
- ✔ New splits recalculated

### Delete Expense
**DELETE** `/expenses/:expenseId`
- ✔ Splits deleted
- ✔ Balance auto-recomputed

---

## 📊 Balance & Settlement APIs

### Group Balance Summary
**GET** `/groups/:groupId/balances`

Response:
```json
{
  "participants": [
    {
      "id": "uuid",
      "name": "Alice",
      "netBalance": -300
    },
    {
      "id": "uuid",
      "name": "You",
      "netBalance": 300
    }
  ]
}
```

### Settlement Suggestions
**GET** `/groups/:groupId/settlements`

Response:
```json
[
  {
    "from": "Alice",
    "to": "You",
    "amount": 300
  }
]
```
*This is derived via greedy matching.*
