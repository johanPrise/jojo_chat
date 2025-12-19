import { useState, useCallback, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const API_KEY_STORAGE = 'mistral_api_key'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKeyState] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE)
    if (stored) setApiKeyState(stored)
  }, [])

  const setApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE, key)
    setApiKeyState(key)
  }

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE)
    setApiKeyState(null)
  }

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !apiKey) return

    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiKey
        }),
      })

      if (!response.ok) throw new Error('Erreur API')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream non disponible')

      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantContent }
        ])
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Une erreur est survenue.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, apiKey])

  return { messages, isLoading, sendMessage, apiKey, setApiKey, clearApiKey }
}
