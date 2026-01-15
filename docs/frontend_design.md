# Frontend Design & Visualizations (Phase 5)

## 🧠 UX Principles
1. **Money clarity beats beauty**: Green = receive, Red = pay.
2. **No math shown**: Derived data only.
3. **Single Question per Screen**: Every screen answers one specific user need.
4. **Green/Red Coding**: Universal indicators for net position.

## 🧩 Information Architecture
\`\`\`mermaid
graph TD
    A[Login / Register] --> B[Groups List]
    B --> C[Group Dashboard]
    C --> D[Summary Cards]
    C --> E[Balance Table]
    C --> F[Settlement Suggestions]
    C --> G[Expense List]
\`\`\`

## 🖥️ Core Screens

### 1️⃣ Auth Screens
- **Login/Register**: Minimalist, distraction-free.

### 2️⃣ Groups List
- **Purpose**: Selection hub.
- **Data**: Group Name, Participant Count, Your Net Position.

### 3️⃣ Group Dashboard (The Hero Screen)
#### Section A: Summary Cards
- **Total Spent**: Sum of all expenses.
- **You Owe**: Red if negative.
- **You Are Owed**: Green if positive.

#### Section B: Balance Table
- **Purpose**: "Who is up, who is down?"
- **Visuals**:
    - Positive: **Green**
    - Negative: **Red**
    - Zero: **Gray**

#### Section C: Settlement Suggestions
- **Purpose**: "How do we settle?"
- **Logic**: Minimal transaction set (from backend `greedy` algo).
- **Action**: "Mark as paid" (future).

#### Section D: Expense List
- **Details**: Description, Date, Payer, Your Share, Total.
- **Interaction**: Expand to see splits.
- **Filters**: Search, Participant, Date, Amount.

## 🎨 Design System
- **Colors**:
    - 🟢 Green (`#10B981`): Receive / Positive
    - 🔴 Red (`#EF4444`): Pay / Negative
    - 🔵 Blue (`#3B82F6`): Info / Neutral
    - ⚪ Gray (`#6B7280`): Zero / Inactive
- **Typography**: Clean, sans-serif (Inter/Roboto).
- **Components**: Modular, reusable.

## 🧱 Component Map
\`\`\`text
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── Groups/
│   │   ├── GroupCard.jsx
│   │   └── CreateGroupModal.jsx
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx
│   │   ├── BalanceTable.jsx
│   │   ├── SettlementList.jsx
│   │   └── ExpenseList.jsx
│   └── Expenses/
│       ├── AddExpenseModal.jsx
│       └── SplitSelector.jsx
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── GroupsPage.jsx
    └── GroupDashboardPage.jsx
\`\`\`

## 🔌 API Integration
- `GET /groups`: Groups List
- `GET /groups/:id/balances`: Balance Table
- `GET /groups/:id/settlements`: Settlement List
- `POST /expenses`: Add Expense
- `GET /expenses`: Expense List
