import React, { useState, useEffect } from 'react';
import { db, auth, signInAnon } from '../../firebase';
// ai import removed - use backend API or Gemini API directly for web
import ai from '../../services/aiWeb';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import * as api from '../../services/api';

import PantryTab from '../PantryTab/PantryTab';
export default RecipeTab;
function RecipeTab() {
  const [search, setSearch] = useState('');
  const [maxCookTime, setMaxCookTime] = useState('60');
  const [maxIngredients, setMaxIngredients] = useState('10');
  const [dietary, setDietary] = useState('');
  const [allowMissing, setAllowMissing] = useState(false);
  const [unit, setUnit] = useState('metric');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [saveFeedback, setSaveFeedback] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalRecipe, setModalRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved recipes from Firestore
  useEffect(() => {
    async function fetchRecipes() {
      await signInAnon();
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDocs(collection(db, 'users', user.uid, 'recipes'));
      setSavedRecipes(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    }
    fetchRecipes();
  }, []);

  // Reset rating and image when opening modal
  useEffect(() => {
    if (showModal && modalRecipe) {
      setRating(modalRecipe.rating || 0);
      setImagePreview(modalRecipe.imageUrl || null);
    }
  }, [showModal, modalRecipe]);

  async function handleRemoveRecipe(idx) {
    const recipe = savedRecipes[idx];
    setSavedRecipes(recipes => recipes.filter((_, i) => i !== idx));
    if (recipe && recipe.id) {
      const user = auth.currentUser;
      if (user) await deleteDoc(collection(db, 'users', user.uid, 'recipes'), recipe.id);
    }
  }

  async function handleGenerateRecipes() {
    async function handleGenerateRecipes() {
      setLoading(true);
      setResults([]);
      setSaveFeedback('');
      await signInAnon();
      const user = auth.currentUser;
      // Get pantry items from Firestore
      let pantryItems = [];
      if (user) {
        const snap = await getDocs(collection(db, 'users', user.uid, 'pantryItems'));
        pantryItems = snap.docs.map(d => d.data().name);
      }
      try {
        // Call Gemini via Firebase AI Logic SDK for high-quality, randomized recipes
        const prompt = `You are a world-class chef. Suggest 3 unique, grade A, creative, and delicious recipes using ONLY these pantry items: ${pantryItems.join(', ')}. Each recipe must be non-trivial (no sandwiches, toast, or basic salads), must be different from each other, and must include a name, description, cook time, servings, full ingredient list, and step-by-step instructions. Randomize the recipes each time. Format the response as a JSON array: [{name, description, cookTime, servings, ingredients, steps, nutrition}].`;
        const result = await ai().invoke('gemini-pro', {
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt }
              ]
            }
          ]
        });
        // Parse Gemini result (expects JSON array)
        let recipes = [];
        try {
          recipes = JSON.parse(result?.candidates?.[0]?.content?.parts?.[0]?.text || '[]');
        } catch {
          // Fallback: treat as plain text, split by lines
          const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          recipes = text.split('\n').map(line => ({ name: line, description: '', cookTime: '', servings: '', ingredients: [], steps: [], nutrition: '' })).filter(r => r.name);
        }
        setResults(recipes);
      } catch (e) {
        setSaveFeedback('Error generating recipes.');
      }
      setLoading(false);
    }

    // Remove used inventory when recipe is marked as made
    async function handleRecipeMade(recipe) {
      if (!recipe.ingredients) return;
      // Fetch pantry
      await signInAnon();
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDocs(collection(db, 'users', user.uid, 'pantryItems'));
      let pantry = snap.docs.map(d => d.data());
      // Deduct ingredients
      const newPantry = pantry.map(item => {
        const used = recipe.ingredients.find(i => i.name && i.name.toLowerCase() === item.name.toLowerCase());
        if (used) {
          return { ...item, quantity: Math.max(0, (item.quantity || 1) - (used.quantity || 1)) };
        }
        return item;
      }).filter(item => (item.quantity || 0) > 0);
      // Save updated pantry
      const invRef = collection(db, 'users', user.uid, 'pantryItems');
      await Promise.all(newPantry.map(item => setDoc(doc(invRef, item.name), item)));
    }

    // When scheduling, check for missing ingredients and add to shopping list (stub)
    async function handleScheduleRecipe(recipe) {
      // TODO: Implement shopping list sync
    }
  function openRecipeModal(recipe) {
    setModalRecipe(recipe);
    setShowModal(true);
    setSaveFeedback('');
    setRating(recipe.rating || 0);
    setImagePreview(recipe.imageUrl || null);
  }
  async function handleSaveRecipe(recipe) {
    if (savedRecipes.some(r => r.name === recipe.name)) {
      setSaveFeedback('Already saved!');
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    const docRef = await addDoc(collection(db, 'users', user.uid, 'recipes'), recipe);
    setSavedRecipes([...savedRecipes, { ...recipe, id: docRef.id }]);
    setSaveFeedback('Recipe saved!');
  }

  // Handle rating change
  async function handleRateRecipe(newRating) {
    if (!modalRecipe || !modalRecipe.id) return;
    setRating(newRating);
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'recipes', modalRecipe.id), { rating: newRating });
    setSavedRecipes(recipes => recipes.map(r => r.id === modalRecipe.id ? { ...r, rating: newRating } : r));
    setModalRecipe(r => ({ ...r, rating: newRating }));
  }

  // Handle image upload
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file || !modalRecipe || !modalRecipe.id) return;
    setUploadingImage(true);
    // Convert to base64 (for demo; in production use Firebase Storage)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setImagePreview(base64);
      const user = auth.currentUser;
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid, 'recipes', modalRecipe.id), { imageUrl: base64 });
      setSavedRecipes(recipes => recipes.map(r => r.id === modalRecipe.id ? { ...r, imageUrl: base64 } : r));
      setModalRecipe(r => ({ ...r, imageUrl: base64 }));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  function closeModal() {
    setShowModal(false);
    setModalRecipe(null);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <>
        <div style={{ height: 32, marginBottom: '1rem' }} />
        <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
          Recipe Search
        </div>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
          <input
            placeholder="Search for recipes..."
            style={inputStyle}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, justifyContent: 'center' }}>
        <input
          type="checkbox"
          id="allow-missing"
          checked={allowMissing}
          onChange={e => setAllowMissing(e.target.checked)}
        />
        <label htmlFor="allow-missing" style={{ color: '#fff', fontSize: 15 }}>Allow missing ingredients</label>
        <button style={btnStyle} onClick={() => setUnit('metric')} disabled={unit === 'metric'}>Metric</button>
        <button style={btnStyle} onClick={() => setUnit('standard')} disabled={unit === 'standard'}>Standard</button>
      </div>





      {/* Recipe Results */}
      {results.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Recipe Results</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r, i) => (
              <div key={i} style={{ background: '#2a0d08', color: '#fff', borderRadius: 8, padding: '0.7rem 1rem', cursor: 'pointer', boxShadow: '0 2px 6px #0003' }} onClick={() => openRecipeModal(r)}>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{r.name}</div>
                <div style={{ fontSize: 13, color: '#bbb' }}>{r.description}</div>
                <div style={{ fontSize: 12, color: '#ffb347' }}>Cook time: {r.cookTime} min | Servings: {r.servings}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Recipes button moved here above Saved Recipes */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
        <button style={{ ...btnStyle, width: 160 }} onClick={handleGenerateRecipes} disabled={loading}>
          {loading ? 'Generating...' : 'Generate 3 Recipes'}
        </button>
      </div>

      {/* Recipe Modal */}
      {showModal && modalRecipe && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }} onClick={closeModal}>
          <div style={{ background: '#fff', color: '#3a1814', borderRadius: 12, padding: 28, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 24px #0008', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 22, color: '#a9441b', cursor: 'pointer' }}>&times;</button>
            <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>{modalRecipe.name}</div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>{modalRecipe.description}</div>
            <div style={{ fontSize: 14, marginBottom: 8 }}><b>Cook time:</b> {modalRecipe.cookTime} min | <b>Servings:</b> {modalRecipe.servings}</div>
            {/* Recipe image upload and preview */}
            <div style={{ margin: '10px 0' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Recipe Image:</div>
              {imagePreview ? (
                <img src={imagePreview} alt="Recipe" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, marginBottom: 6 }} />
              ) : (
                <div style={{ color: '#bbb', fontSize: 13, marginBottom: 6 }}>No image uploaded.</div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ marginBottom: 6 }} />
              {uploadingImage && <span style={{ color: '#a9441b', fontSize: 13 }}>Uploading...</span>}
            </div>
            {/* Recipe rating */}
            <div style={{ margin: '10px 0' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Your Rating:</div>
              <div>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    style={{
                      fontSize: 24,
                      color: star <= rating ? '#ffb347' : '#bbb',
                      cursor: 'pointer',
                      marginRight: 2,
                    }}
                    onClick={() => handleRateRecipe(star)}
                  >★</span>
                ))}
              </div>
            </div>
            <div style={{ fontWeight: 'bold', marginTop: 10 }}>Ingredients:</div>
            <ul style={{ margin: '6px 0 12px 18px', fontSize: 15 }}>
              {modalRecipe.ingredients.map((ing, idx) => {
                const missing = modalRecipe.missingIngredients && modalRecipe.missingIngredients.includes(ing);
                return (
                  <li key={idx} style={missing ? { color: '#e74c3c', fontWeight: 600 } : {}}>
                    {ing} {missing ? '(missing)' : ''}
                  </li>
                );
              })}
            </ul>
            <div style={{ fontWeight: 'bold' }}>Steps:</div>
            <ol style={{ margin: '6px 0 0 18px', fontSize: 15 }}>
              {modalRecipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}
            </ol>
            <div style={{ fontWeight: 'bold', marginTop: 12 }}>Nutrition:</div>
            <div style={{ fontSize: 14, color: '#3a1814', marginBottom: 8 }}>{modalRecipe.nutrition || 'N/A'}</div>
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button style={{ ...btnStyle, width: 120 }} onClick={() => handleSaveRecipe(modalRecipe)}>Save Recipe</button>
              {saveFeedback && <span style={{ color: saveFeedback === 'Recipe saved!' ? 'green' : 'red', fontWeight: 'bold' }}>{saveFeedback}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Saved Recipes */}
      <div style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center' }}>
        Saved Recipes
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {savedRecipes.length === 0 && (
          <div style={{ color: '#bbb', textAlign: 'center' }}>No saved recipes.</div>
        )}
        {savedRecipes.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <a href={r.url} style={{ color: '#6cf', fontSize: 16, textDecoration: 'underline', flex: 1 }}>
              {r.name}
            </a>
            <button
              style={{
                ...btnStyle,
                background: '#e74c3c',
                width: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 38,
                padding: 0,
                fontSize: 16,
              }}
              onClick={() => handleRemoveRecipe(i)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );

// Style constants must be at top level
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

const labelStyle = {
  color: '#fff',
  fontSize: 13,
  marginBottom: 2,
};
  }}
