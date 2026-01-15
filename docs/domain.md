# Core Entities

## 1️⃣ User
A real account that can log in.

**Rules**
- Has email & password
- Can create multiple groups
- Can appear as a participant in a group
- Exists even without any groups

## 2️⃣ Group
A logical container for shared expenses.

**Rules**
- Owned by exactly one user
- Max 4 participants total (owner + 3)
- Deleting group deletes:
  - participants
  - expenses
  - splits (cascade)

## 3️⃣ Participant
A financial identity inside a group.

**Rules**
- Exists only inside a group
- May or may not map to a real user
- Has name, optional color/avatar
- One participant per user per group (no duplicates)

🔥 **Critical Insight (Interview-level):**
We separate identity (user) from liability (participant)

## 4️⃣ Expense
A transaction inside a group.

**Rules**
- Belongs to exactly one group
- Has exactly one payer (participant)
- Can involve 1–N participants
- Always split fully (no leftovers)

## 5️⃣ ExpenseSplit
Defines how an expense is shared.

**Rules**
- One split per participant per expense
- Sum of splits = expense amount
- Stored as final resolved amounts (not percentages)
