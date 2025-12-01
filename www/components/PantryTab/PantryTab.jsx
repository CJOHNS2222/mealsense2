
import React, { useState, useEffect } from 'react';
import { db, auth, signInAnon, callGemini } from '../../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';


function PantryTab() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzeMsg, setAnalyzeMsg] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editCategory, setEditCategory] = useState('Canned');
  const [manualName, setManualName] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const [manualCategory, setManualCategory] = useState('Canned');
  const [manualExpiry, setManualExpiry] = useState('');

  // Load inventory from Firestore on mount
  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      await signInAnon();
      const user = auth.currentUser;
      if (!user) return setLoading(false);
      const invRef = doc(db, 'users', user.uid, 'pantry', 'inventory');
      const invSnap = await getDocs(collection(db, 'users', user.uid, 'pantryItems'));
      setInventory(invSnap.docs.map(d => d.data()));
      setLoading(false);
    }
    fetchInventory();
  }, []);

  // Save inventory to Firestore
  async function saveInventory(newInv) {
    const user = auth.currentUser;
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'pantryItems');
    const invRef = doc(db, 'users', user.uid, 'pantry', 'inventory');
    await setDoc(invRef, { items: newInv });
  }

  function handleCheck(idx) {
    setInventory(inv =>
      inv.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function handleEdit(idx) {
    setEditIdx(idx);
    setEditName(inventory[idx].name);
    setEditExpiry(inventory[idx].expiry);
    setEditCategory(inventory[idx].category || 'Canned');
  }

  function handleEditSave(idx) {
    setInventory(inv =>
      inv.map((item, i) =>
        i === idx ? { ...item, name: editName, expiry: editExpiry, category: editCategory } : item
      )
    );
    setEditIdx(null);
    setEditName('');
    setEditExpiry('');
    setEditCategory('Canned');
  }

  function handleEditCancel() {
    setEditIdx(null);
    setEditName('');
    setEditExpiry('');
    setEditCategory('Canned');
  }

  function handleImageUpload(idx, e) {
    const file = e.target.files[0];
    if (!file) return;
    setInventory(inv =>
      inv.map((item, i) =>
        i === idx ? { ...item, img: file.name } : item
      )
    );
  }

  function handleAddManual() {
    if (!manualName.trim()) return;
    const newInv = [
      ...inventory,
      { name: manualName, qty: manualQty, expiry: manualExpiry, img: '', checked: false, category: manualCategory },
    ];
    setInventory(newInv);
    saveInventory(newInv);
    setManualName('');
    setManualQty(1);
    setManualCategory('Canned');
    setManualExpiry('');
  }

  function handleQtyChange(idx, delta) {
    const newInv = inventory.map((item, i) =>
      i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    setInventory(newInv);
    saveInventory(newInv);
  }

  function handleRemove(idx) {
    const newInv = inventory.filter((_, i) => i !== idx);
    setInventory(newInv);
    saveInventory(newInv);
  }

  // Analyze image handler
  
  async function handleAnalyzeImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAnalyzeMsg('Analyzing image...');
    try {
      const reader = new FileReader();
      reader.onload = async function(evt) {
        const base64 = evt.target.result.split(',')[1];
        // Gemini expects modelName and contents
        const payload = {
          modelName: 'gemini-pro-vision',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: 'What food items do you see in this image? List only the food names.' }
              ]
            }
          ]
        };
        const result = await callGemini(payload);
        // You may need to parse result.data.result.candidates[0].content.parts[0].text
        const text = result.data?.result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        // Try to extract items from the text (split by comma, line, etc.)
        const detected = text
          .split(/\n|,|;/)
          .map(s => s.trim())
          .filter(Boolean);
        if (detected.length) {
          const newInv = [...inventory];
          detected.forEach(name => {
            if (!newInv.some(i => i.name.toLowerCase() === name.toLowerCase())) {
              newInv.push({ name, qty: 1, expiry: '', img: '', checked: false, category: 'Other' });
            }
          });
          setInventory(newInv);
          saveInventory(newInv);
          setAnalyzeMsg(`Added ${detected.length} item(s) from image!`);
        } else {
          setAnalyzeMsg('No items detected.');
        }
        setTimeout(() => setAnalyzeMsg(''), 2000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setAnalyzeMsg('Error analyzing image.');
      setTimeout(() => setAnalyzeMsg(''), 2000);
    }
  }
  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ height: 32, marginBottom: '1rem' }} />

      {/* Camera/Image area with mobile-friendly input */}
      <div style={{
        background: '#8883',
        color: '#bbb',
        border: '2px dashed #bbb',
        borderRadius: 16,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        marginBottom: 16,
        flexDirection: 'column',
        position: 'relative',
      }}>
        <div style={{ fontSize: 32, fontWeight: 500 }}>camera</div>
        <div style={{ fontSize: 16, marginBottom: 8 }}>
          {inventory[0]?.img ? `Image: ${inventory[0].img}` : 'No image selected'}
        </div>
        <label style={{
          background: 'linear-gradient(90deg, #a9441b 0%, #ffb347 100%)',
          color: '#fff',
          borderRadius: 8,
          padding: '0.5rem 1.2rem',
          fontWeight: 'bold',
          fontSize: 16,
          cursor: 'pointer',
          marginTop: 8,
        }}>
          Open Camera / Gallery
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => handleImageUpload(0, e)}
          />
        </label>
      </div>


      {/* Analyze Image with Gemini */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <input type="file" accept="image/*" id="analyze-image-input" style={{ display: 'none' }} onChange={handleAnalyzeImage} />
        <button style={{ ...btnStyle, width: 180 }} onClick={() => document.getElementById('analyze-image-input').click()}>Analyze Image</button>
      </div>



      {analyzeMsg && <div style={{ color: '#4fd1c5', textAlign: 'center', marginBottom: 10 }}>{analyzeMsg}</div>}

 

      {/* Manual add */}
      <div style={{ textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 20 }}>
        Add Item Manually
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        <input
          placeholder="Item name"
          style={inputStyle}
          value={manualName}
          onChange={e => setManualName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          style={{ ...inputStyle, width: 60 }}
          value={manualQty}
          onChange={e => setManualQty(Number(e.target.value))}
        />
        <select style={{ ...inputStyle, width: 100 }} value={manualCategory} onChange={e => setManualCategory(e.target.value)}>
          <option value="Canned">Canned</option>
          <option value="Fresh">Fresh</option>
          <option value="Frozen">Frozen</option>
          <option value="Dry">Dry</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          style={{ ...inputStyle, width: 140 }}
          value={manualExpiry}
          onChange={e => setManualExpiry(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button style={{ ...btnStyle, width: 180 }} onClick={handleAddManual}>ADD TO PANTRY</button>
      </div>

      {/* Inventory list */}
      <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>
        Your Inventory <span style={{ color: '#bbb', fontWeight: 400 }}>({inventory.length} items)</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 32,
      }}>
        {inventory.map((item, i) => (
          <div key={i} style={{
            background: '#2a0d08',
            borderRadius: 10,
            padding: 10,
            color: '#fff',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={item.checked} onChange={() => handleCheck(i)} />
              <div style={{ width: 36, height: 36, background: '#fff2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span role="img" aria-label="img">🖼️</span>
                <input type="file" accept="image/*" style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', cursor: 'pointer' }} onChange={e => handleImageUpload(i, e)} title="Upload image" />
              </div>
              {editIdx === i ? (
                <>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ ...inputStyle, fontSize: 14, minWidth: 80 }}
                  />
                </>
              ) : (
                <div style={{ fontWeight: 500, fontSize: 15, flex: 1 }}>{item.name}</div>
              )}
              <button style={{ ...miniBtn, background: '#e74c3c' }} onClick={() => handleRemove(i)}>Remove</button>
            </div>
            <div style={{ fontSize: 13, color: '#bbb' }}>
              {editIdx === i ? (
                <>
                  <input
                    value={editExpiry}
                    onChange={e => setEditExpiry(e.target.value)}
                    style={{ ...inputStyle, fontSize: 13, minWidth: 80 }}
                    type="date"
                  />
                  <select style={{ ...inputStyle, width: 100, fontSize: 13 }} value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                    <option value="Canned">Canned</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Dry">Dry</option>
                    <option value="Other">Other</option>
                  </select>
                </>
              ) : (
                <>
                  {item.expiry ? item.expiry : 'No expiry'}
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#ffb347' }}>{item.category}</span>
                </>
              )}
              {item.img && (
                <span style={{ color: '#ffb347', marginLeft: 8, fontSize: 12 }}>📷 {item.img}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={miniBtn} onClick={() => handleQtyChange(i, -1)}>-</button>
              <span style={{ minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
              <button style={miniBtn} onClick={() => handleQtyChange(i, 1)}>+</button>
              {editIdx === i ? (
                <>
                  <button style={miniBtn} onClick={() => handleEditSave(i)}>Save</button>
                  <button style={miniBtn} onClick={handleEditCancel}>Cancel</button>
                </>
              ) : (
                <button style={miniBtn} onClick={() => handleEdit(i)}>Edit</button>
              )}
              {/* Date button can open a date picker in future */}
              <button style={miniBtn} onClick={() => handleEdit(i)}>Date</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PantryTab;

const btnStyle = {
  background: 'linear-gradient(90deg, #a9441b 0%, #ffb347 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '0.6rem 1.2rem',
  fontWeight: 'bold',
  fontSize: 16,
  boxShadow: '0 2px 6px #0003',
  cursor: 'pointer',
};

const inputStyle = {
  borderRadius: 6,
  border: '1px solid #bbb',
  padding: '0.5rem 0.8rem',
  fontSize: 16,
  outline: 'none',
  minWidth: 120,
};

const miniBtn = {
  ...btnStyle,
  fontSize: 13,
  padding: '0.2rem 0.7rem',
  borderRadius: 6,
  boxShadow: 'none',
};
