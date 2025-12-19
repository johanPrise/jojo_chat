import { NextRequest } from 'next/server'

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'

export async function POST(request: NextRequest) {
  const { messages, apiKey } = await request.json()

  if (!apiKey) {
    return new Response('Clé API manquante', { status: 400 })
  }

  const response = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'open-mixtral-8x22b',
      messages,
      stream: true,
    }),
  })

  if (!response.ok) {
    return new Response('Erreur Mistral API', { status: response.status })
  }

  const reader = response.body?.getReader()
  if (!reader) {
    return new Response('Stream non disponible', { status: 500 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          } catch {
          }
        }
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
