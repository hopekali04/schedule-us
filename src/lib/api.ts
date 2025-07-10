// lib/api.ts
import { Categories, Goal, Group } from "@/types/types";

// A helper to make authenticated requests
async function fetchAPI(path: string, options: RequestInit = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Use NEXT_PUBLIC_API_URL to construct the full URL
  // const url = `${process.env.NEXT_PUBLIC_API_URL}/api${path}`;
  const url = `/api${path}`;
  const res = await fetch(url, mergedOptions);

  if (!res.ok) {
    const errorBody = await res.json();
    console.error(`API Error on ${path}:`, errorBody.error);
    // Propagate a user-friendly error message
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  
  // Handle responses that might not have a body (e.g., DELETE 204 No Content)
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return res.json();
  }
  return; // Return undefined for non-JSON responses
}

// --- Goal APIs ---
export const createGoal = (data: Partial<Goal>) => fetchAPI('/goals', { method: 'POST', body: JSON.stringify(data) });
export const updateGoal = (id: string, data: Partial<Goal>) => fetchAPI(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteGoal = (id: string) => fetchAPI(`/goals/${id}`, { method: 'DELETE' });
export const updateGoalStep = (goalId: string, stepId: string, isCompleted: boolean) => fetchAPI(`/goals/${goalId}/steps/${stepId}`, { method: 'PATCH', body: JSON.stringify({ isCompleted }) });

// --- Group APIs ---
export const createGroup = (data: Partial<Group>) => fetchAPI('/groups', { method: 'POST', body: JSON.stringify(data) });
export const updateGroup = (id: string, data: Partial<Group>) => fetchAPI(`/groups/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteGroup = (id: string) => fetchAPI(`/groups/${id}`, { method: 'DELETE' });
export const addGroupMember = (groupId: string, email: string) => fetchAPI(`/groups/${groupId}/members`, { method: 'POST', body: JSON.stringify({ email }) });
export const removeGroupMember = (groupId: string, memberUserId: string) => fetchAPI(`/groups/${groupId}/members/${memberUserId}`, { method: 'DELETE' });

// --- Category APIs ---
export const createCategory = (data: Partial<Categories>) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id: string, data: Partial<Categories>) => fetchAPI(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteCategory = (id: string) => fetchAPI(`/categories/${id}`, { method: 'DELETE' });
export const getAllCategories = () => fetchAPI('/categories', { method: 'GET' });


// --- User APIs ---
// NOTE: We don't have a user API yet, but this is how you would add it.
// We'll create a profile modal that might use this in the future.
// For now, user creation is handled automatically on sign-up.
// export const updateUserProfile = (data: Partial<User>) => fetchAPI('/user/profile', { method: 'PATCH', body: JSON.stringify(data) });

// --- AI APIs ---
export const generateAiSuggestions = () => fetchAPI('/ai/generate-suggestions', { method: 'POST' });