import { db, auth } from '../firebase';
import { collection, doc, setDoc, getDoc, addDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Create a new family group
export async function createFamilyGroup(groupName) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const groupRef = await addDoc(collection(db, 'familyGroups'), {
    name: groupName,
    owner: user.uid,
    members: [user.uid],
    created: Date.now(),
  });
  await updateDoc(doc(db, 'users', user.uid), {
    familyGroup: groupRef.id,
  });
  return groupRef.id;
}

// Join an existing family group by code (groupId)
export async function joinFamilyGroup(groupId) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const groupRef = doc(db, 'familyGroups', groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(user.uid),
  });
  await updateDoc(doc(db, 'users', user.uid), {
    familyGroup: groupId,
  });
}

// Leave current family group
export async function leaveFamilyGroup() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const groupId = userDoc.data()?.familyGroup;
  if (!groupId) return;
  await updateDoc(doc(db, 'familyGroups', groupId), {
    members: arrayRemove(user.uid),
  });
  await updateDoc(doc(db, 'users', user.uid), {
    familyGroup: null,
  });
}

// Listen to current user's family group
export function useFamilyGroup(onUpdate) {
  const user = auth.currentUser;
  if (!user) return;
  const unsub = onSnapshot(doc(db, 'users', user.uid), async (userSnap) => {
    const groupId = userSnap.data()?.familyGroup;
    if (!groupId) return onUpdate(null);
    const groupSnap = await getDoc(doc(db, 'familyGroups', groupId));
    onUpdate({ id: groupId, ...groupSnap.data() });
  });
  return unsub;
}


