# Database Schema

## Tables

### User
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `email` | VARCHAR | UNIQUE |
| `password_hash` | VARCHAR | |
| `created_at` | TIMESTAMP | |

### Group
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `name` | VARCHAR | |
| `created_by` | UUID | FK users |
| `created_at` | TIMESTAMP | |

### Participant
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `group_id` | UUID | FK groups ON DELETE CASCADE |
| `user_id` | UUID | FK users NULL |
| `name` | VARCHAR | |
| `color` | VARCHAR | |

### Expense
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `group_id` | UUID | FK groups ON DELETE CASCADE |
| `payer_participant_id` | UUID | FK participants |
| `amount` | DECIMAL(10,2) | |
| `description` | VARCHAR | |
| `date` | DATE | |
| `created_at` | TIMESTAMP | |

### ExpenseSplit
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `expense_id` | UUID | FK expenses ON DELETE CASCADE |
| `participant_id` | UUID | FK participants |
| `amount` | DECIMAL(10,2) | |

---

## 🧠 Rounding Rule (Locked)

All amounts stored as **DECIMAL(10,2)**

**Equal splits:**
1. Calculate `base = floor(total / N * 100) / 100`
2. Distribute remaining cents to first K participants

*This avoids floating drift.*
