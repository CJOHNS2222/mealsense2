// API service for connecting React UI to Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Recipe API calls
export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

export async function addRecipe(recipeName) {
  const response = await fetch(`${API_BASE_URL}/recipes?name=${encodeURIComponent(recipeName)}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to add recipe');
  return response.text();
}

// Family Group API calls
export async function fetchFamilyGroups() {
  const response = await fetch(`${API_BASE_URL}/family`);
  if (!response.ok) throw new Error('Failed to fetch family groups');
  return response.json();
}

export async function createFamilyGroup(groupName) {
  const response = await fetch(`${API_BASE_URL}/family?name=${encodeURIComponent(groupName)}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to create family group');
  return response.text();
}

export async function joinFamilyGroup(groupId) {
  const response = await fetch(`${API_BASE_URL}/family/join?groupId=${encodeURIComponent(groupId)}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to join family group');
  return response.text();
}

export async function leaveFamilyGroup(groupId) {
  const response = await fetch(`${API_BASE_URL}/family/leave?groupId=${encodeURIComponent(groupId)}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to leave family group');
  return response.text();
}

// Auth API calls (placeholder for future backend auth)
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Failed to register');
  return response.json();
}
