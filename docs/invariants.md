# Invariants (System Laws)

**Invariant 1:** `Sum(expense_splits.amount) == expense.amount`

**Invariant 2:** Participant belongs to exactly one group

**Invariant 3:** Expense payer must be one of the split participants

**Invariant 4:** No group can have > 4 participants

**Invariant 5:** Balance is derived data (never stored permanently)

💡 **This single decision (derived balance) makes your system robust.**
