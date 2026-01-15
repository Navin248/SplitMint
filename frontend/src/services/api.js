const BASE_URL = 'http://localhost:4000';

export const api = {
    BASE_URL, // Export for direct usage if needed
    // Auth
    register: (data) => fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    login: (data) => fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Groups
    getGroups: (token) => fetch(`${BASE_URL}/groups`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    createGroup: (token, data) => fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    deleteGroup: (token, groupId) => fetch(`${BASE_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    // Participants
    addParticipant: (token, groupId, data) => fetch(`${BASE_URL}/participants/${groupId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    // Expenses
    addExpense: (token, groupId, data) => fetch(`${BASE_URL}/expenses/${groupId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json()),

    getExpenses: (token, groupId) => fetch(`${BASE_URL}/expenses/${groupId}`, { // This endpoint might need to be created if not exists? Wait, plan says GET /expenses (by group). Let's check routes.
        // The plan had GET /expenses, but the implemented route was POST /:groupId, PUT /:expenseId, DELETE /:expenseId.
        // I missed implementing "Get Expenses" in the backend!
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    // Balance
    getBalances: (token, groupId) => fetch(`${BASE_URL}/groups/${groupId}/balances`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),

    getSettlements: (token, groupId) => fetch(`${BASE_URL}/groups/${groupId}/settlements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
};
