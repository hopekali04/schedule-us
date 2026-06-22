// hooks/use-ai-suggestions.ts
"use client";

import * as React from 'react';
import { generateAiSuggestions } from '@/lib/api';

export interface AISuggestion {
  name: string;
  description: string;
  steps: string[];
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
}

export function useAISuggestions() {
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateAiSuggestions() as AISuggestionsResponse;
      setSuggestions(response.suggestions || []);
    } catch (err) {
      console.error('Failed to generate AI suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate AI suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setError(null);
  };

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    clearSuggestions
  };
}