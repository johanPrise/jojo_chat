import { useState, useEffect } from 'react'

const API_KEY_STORAGE = 'mistral_api_key'

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE)
    if (stored) setApiKeyState(stored)
  }, [])

  const validateAndSetApiKey = async (key: string): Promise<boolean> => {
    setIsValidating(true)
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      })

      if (response.ok) {
        localStorage.setItem(API_KEY_STORAGE, key)
        setApiKeyState(key)
        return true
      }
      return false
    } catch {
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE)
    setApiKeyState(null)
  }

  return { apiKey, isValidating, validateAndSetApiKey, clearApiKey }
}
