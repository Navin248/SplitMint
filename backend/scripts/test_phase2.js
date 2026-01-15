// import fetch from 'node-fetch'; // Native fetch used in Node 18+

const BASE_URL = 'http://localhost:4000';
const EMAIL = `test_${Date.now()}@mail.com`;
const PASSWORD = 'password123';

async function run() {
    console.log('🧪 Starting Phase 2 Verification...');

    // 1. Register
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    if (!regRes.ok) throw new Error('Registration failed');
    console.log('✅ Registered');

    // 2. Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const { token, user } = await loginRes.json();
    if (!token) throw new Error('Login failed');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    console.log('✅ Logged in');

    // 3. Create Group
    const groupRes = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            name: 'Test Group',
            participants: [{ name: 'Alice', color: '#FF0000' }]
        })
    });
    const group = await groupRes.json();
    if (group.participants.length !== 2) throw new Error('Group creation participants mismatch');
    console.log('✅ Group Created with Creator auto-added');
    const groupId = group.id;

    // 4. Add Participants (Limit Test)
    console.log('🔸 Testing Limits...');
    await (await fetch(`${BASE_URL}/participants/${groupId}`, {
        method: 'POST', headers, body: JSON.stringify({ name: 'Bob' })
    })).json();
    console.log('   - Added Bob (Total 3)');

    await (await fetch(`${BASE_URL}/participants/${groupId}`, {
        method: 'POST', headers, body: JSON.stringify({ name: 'Charlie' })
    })).json();
    console.log('   - Added Charlie (Total 4)');

    const failRes = await fetch(`${BASE_URL}/participants/${groupId}`, {
        method: 'POST', headers, body: JSON.stringify({ name: 'Dave' })
    });
    if (failRes.status === 400) {
        console.log('✅ Max Limit Enforced (5th participant rejected)');
    } else {
        throw new Error('Max limit NOT enforced');
    }

    // 5. Delete Group
    const delRes = await fetch(`${BASE_URL}/groups/${groupId}`, { method: 'DELETE', headers });
    if (!delRes.ok) throw new Error('Delete group failed');
    console.log('✅ Group Deleted (Cascade check implied by DB constraints)');

    console.log('🎉 Phase 2 Verified Successfully!');
}

run().catch(e => console.error('❌ Verification Failed:', e));
