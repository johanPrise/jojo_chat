import { useState, useCallback } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(apiKey: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Une erreur est survenue.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, apiKey])

  return { messages, isLoading, sendMessage }
}
