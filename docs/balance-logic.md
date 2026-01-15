# Balance Logic & Behaviors

## Balance Engine: Concept Only

### Balance Definition
Each participant has a net balance
- **Positive** → others owe them
- **Negative** → they owe others

### Balance Formula
For each expense:
```
payer paid X
participant share = Y

payer balance += (X - Y)
other participant balance -= Y
```
**Balance is computed by iterating expenses, not stored.**

---

## Deletion Behavior (Critical)

| Action | What Happens |
| :--- | :--- |
| **Delete Group** | Delete participants → expenses → splits |
| **Delete Participant** | Remove from splits → recalc balances |
| **Delete Expense** | Remove splits → recalc balances |
| **Edit Expense** | Delete old splits → recompute |

This prevents silent corruption.

---

## Split Modes (Decision Matrix)

### Equal Split
- `amount / number_of_participants`
- → distribute remainder fairly (rounding rule)

### Custom Amount
- User provides exact amounts
- Validate `sum == total`

### Percentage
- Convert `%` → amount
- Validate `sum == 100`

🔥 **Golden Rule:**
Store only final computed amounts, never percentages.
