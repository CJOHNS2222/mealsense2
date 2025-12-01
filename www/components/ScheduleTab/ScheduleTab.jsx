
import React, { useState, useRef } from 'react';

const initialDays = [
  { day: 'Saturday', date: '2025-11-29', meal: '' },
  { day: 'Sunday', date: '2025-11-30', meal: '' },
  { day: 'Monday', date: '2025-12-01', meal: '' },
  { day: 'Tuesday', date: '2025-12-02', meal: '' },
  { day: 'Wednesday', date: '2025-12-03', meal: '' },
  { day: 'Thursday', date: '2025-12-04', meal: '' },
  { day: 'Friday', date: '2025-12-05', meal: '' },
];

export default function ScheduleTab() {
  const [days, setDays] = useState(initialDays);
  const [editIdx, setEditIdx] = useState(null);
  const [editMeal, setEditMeal] = useState('');
  const [feedback, setFeedback] = useState('');
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);
  const trashRef = useRef();
  function handleDragStart(idx) {
    setDraggedIdx(idx);
  }

  function handleDragOver(idx, e) {
    e.preventDefault();
  }

  function handleDrop(idx) {
    if (draggedIdx === null || draggedIdx === idx) return;
    setDays(ds => {
      const newDays = [...ds];
      const temp = newDays[draggedIdx].meal;
      newDays[draggedIdx].meal = newDays[idx].meal;
      newDays[idx].meal = temp;
      return newDays;
    });
    setDraggedIdx(null);
  }

  function handleDragEnd() {
    setDraggedIdx(null);
    setDragOverTrash(false);
  }

  function handleTrashDragOver(e) {
    e.preventDefault();
    setDragOverTrash(true);
  }

  function handleTrashDragLeave() {
    setDragOverTrash(false);
  }

  function handleTrashDrop() {
    if (draggedIdx === null) return;
    setDays(ds => ds.map((d, i) => i === draggedIdx ? { ...d, meal: '' } : d));
    setDraggedIdx(null);
    setDragOverTrash(false);
    setFeedback('Meal removed from schedule.');
  }

  function handleEdit(idx) {
    setEditIdx(idx);
    setEditMeal(days[idx].meal);
    setFeedback('');
  }

  function handleSave(idx) {
    setDays(ds => ds.map((d, i) => i === idx ? { ...d, meal: editMeal } : d));
    setEditIdx(null);
    setEditMeal('');
    setFeedback('Meal scheduled!');
  }

  function handleCancel() {
    setEditIdx(null);
    setEditMeal('');
  }

  function handleAddMissingIngredients() {
    // Stub: In real app, would analyze meals and add missing ingredients to shopping list
    setFeedback('Missing ingredients added to shopping list!');
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ height: 32, marginBottom: '1rem' }} />

      <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
        Meal Schedule
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <button style={linkBtnStyle} onClick={handleAddMissingIngredients}>Add Missing Ingredients to Shopping List</button>
      </div>
      {feedback && <div style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>{feedback}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              background: draggedIdx === i ? '#ffb347' : 'linear-gradient(90deg, #a9441b 0%, #ffb347 100%)',
              borderRadius: 10,
              padding: '0.7rem 1.2rem',
              color: draggedIdx === i ? '#3a1814' : '#fff',
              boxShadow: '0 2px 6px #0003',
              fontWeight: 'bold',
              fontSize: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              opacity: draggedIdx === i ? 0.7 : 1,
              cursor: d.meal ? 'grab' : 'default',
            }}
            draggable={!!d.meal}
            onDragStart={() => d.meal && handleDragStart(i)}
            onDragOver={e => handleDragOver(i, e)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
          >
            <span style={{ fontSize: 20 }}>{d.day}</span>
            <span style={{ fontWeight: 400, fontSize: 15 }}>{d.date}</span>
            <span style={{ fontWeight: 400, fontSize: 15, color: draggedIdx === i ? '#3a1814' : '#fff' }}>
              {editIdx === i ? (
                <>
                  <input
                    value={editMeal}
                    onChange={e => setEditMeal(e.target.value)}
                    style={{ borderRadius: 6, border: '1px solid #bbb', padding: '0.3rem 0.7rem', fontSize: 15, minWidth: 120 }}
                  />
                  <button style={{ ...linkBtnStyle, marginLeft: 8, color: '#fff', border: '2px solid #fff', background: '#a9441b' }} onClick={() => handleSave(i)}>Save</button>
                  <button style={{ ...linkBtnStyle, marginLeft: 4, color: '#fff', border: '2px solid #fff', background: '#a9441b' }} onClick={handleCancel}>Cancel</button>
                </>
              ) : d.meal ? (
                <>
                  {d.meal} <button style={{ ...linkBtnStyle, marginLeft: 8, color: '#fff', border: '2px solid #fff', background: '#a9441b' }} onClick={() => handleEdit(i)}>Edit</button>
                </>
              ) : (
                <>
                  <span style={{ color: '#eee' }}>No meal planned</span> <button style={{ ...linkBtnStyle, marginLeft: 8, color: '#fff', border: '2px solid #fff', background: '#a9441b' }} onClick={() => handleEdit(i)}>Add</button>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Trash can for removing meals by drag-and-drop */}
      <div
        ref={trashRef}
        onDragOver={handleTrashDragOver}
        onDragLeave={handleTrashDragLeave}
        onDrop={handleTrashDrop}
        style={{
          width: 80,
          height: 80,
          margin: '0 auto',
          borderRadius: 40,
          background: dragOverTrash ? '#e74c3c' : '#2a0d08',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: dragOverTrash ? '#fff' : '#ffb347',
          fontSize: 36,
          boxShadow: dragOverTrash ? '0 0 16px #e74c3c' : '0 2px 6px #0003',
          border: dragOverTrash ? '3px solid #fff' : '3px solid #ffb347',
          transition: 'all 0.2s',
        }}
        title="Drag a meal here to remove"
      >
        🗑️
      </div>
    </div>
  );
}

const linkBtnStyle = {
  background: 'none',
  color: '#6cf',
  border: '2px solid #6cf',
  borderRadius: 8,
  padding: '0.5rem 1.2rem',
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  textDecoration: 'underline',
};
