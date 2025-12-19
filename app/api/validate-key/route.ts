import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { apiKey } = await request.json()

  if (!apiKey) {
    return new Response('Clé API manquante', { status: 400 })
  }

  const response = await fetch('https://api.mistral.ai/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (response.ok) {
    return new Response('OK', { status: 200 })
  }

  return new Response('Clé API invalide', { status: 401 })
}
