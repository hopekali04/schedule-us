// app/api/ai/generate-suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth-helper';
import { adminDb } from '@/lib/firebase-admin';
import { getGoalsWithProgress } from '@/lib/goal-helper';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.NEXT_GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'Google API key is not configured.' }, { status: 500 });
  }

  try {
    // 1. Fetch user's recent goals for context
    const memberQuery = await adminDb.collection('group_members').where('userId', '==', userId).get();
    const groupIds = memberQuery.docs.map(doc => doc.data().groupId);
    if (groupIds.length === 0) return NextResponse.json({ suggestions: [] });

    const goalsQuery = await adminDb.collection('goals').where('groupId', 'in', groupIds).orderBy('endAt', 'desc').limit(10).get();
    const recentGoals = await getGoalsWithProgress(goalsQuery.docs);

    // 2. Construct the prompt for Gemini
    const prompt = `
      You are an expert productivity coach. A user wants new goal suggestions.
      Analyze their existing goals and generate 3 new, distinct, and actionable goal suggestions.

      User's Recent Goals:
      ${recentGoals.length > 0 ? recentGoals.map(g => `- ${g.name} (Status: ${g.status})`).join('\n') : "User has no goals yet."}

      Based on this, suggest 3 new goals. For each suggestion, provide a name, a description, and an array of 3-5 steps.
      
      Return ONLY a valid JSON object in the following format, with no other text, commentary, or markdown fences.
      {
        "suggestions": [
          {
            "name": "Goal Name 1",
            "description": "Goal description 1.",
            "steps": ["Step 1.1", "Step 1.2", "Step 1.3"]
          },
          {
            "name": "Goal Name 2",
            "description": "Goal description 2.",
            "steps": ["Step 2.1", "Step 2.2"]
          },
          {
            "name": "Goal Name 3",
            "description": "Goal description 3.",
            "steps": ["Step 3.1", "Step 3.2", "Step 3.3", "Step 3.4"]
          }
        ]
      }
    `;
    
    // 3. Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse and return the suggestions
    const parsedSuggestions = JSON.parse(text);
    return NextResponse.json(parsedSuggestions, { status: 200 });

  } catch (error) {
    console.error("Gemini suggestion generation failed:", error);
    return NextResponse.json({ error: 'Failed to generate AI suggestions.' }, { status: 500 });
  }
}