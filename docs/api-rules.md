# API Design Principles

## 🧭 Core Rules
1. **RESTful, resource-based APIs**
2. **No balance stored in DB** (derived only)
3. **IDs are opaque** (UUID)
4. **Auth required for everything** except login/register
5. **Group-scoped data only** (no cross-group leaks)

These principles guide every endpoint.
