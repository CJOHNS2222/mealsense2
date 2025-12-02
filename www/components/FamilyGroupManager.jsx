import React, { useEffect, useState } from 'react';
import { createFamilyGroup, joinFamilyGroup, leaveFamilyGroup, useFamilyGroup } from './FamilyGroup.js';

export default function FamilyGroupManager() {
  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = useFamilyGroup(setGroup);
    return () => unsub && unsub();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createFamilyGroup(groupName);
      setGroupName('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleJoin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await joinFamilyGroup(joinCode);
      setJoinCode('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleLeave() {
    setLoading(true);
    setError('');
    try {
      await leaveFamilyGroup();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 24 }}>
      <h2>Family Group</h2>
      {group ? (
        <div>
          <div><b>Group Name:</b> {group.name}</div>
          <div><b>Group Code:</b> {group.id}</div>
          <div><b>Members:</b> {group.members?.length || 1}</div>
          <button onClick={handleLeave} style={{ marginTop: 16, background: '#eee', border: 'none', borderRadius: 6, padding: '0.5rem 1.2rem', cursor: 'pointer' }}>Leave Group</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleCreate} style={{ marginBottom: 18 }}>
            <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="New group name" required style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
            <button type="submit" style={{ width: '100%', background: '#ffb347', color: '#222', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 'bold', fontSize: 17 }}>Create Group</button>
          </form>
          <form onSubmit={handleJoin}>
            <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Join code" required style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #bbb' }} />
            <button type="submit" style={{ width: '100%', background: '#4285F4', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 'bold', fontSize: 17 }}>Join Group</button>
          </form>
        </>
      )}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  );
}
