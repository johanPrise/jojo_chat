'use client'

import { useState, FormEvent } from 'react'
import { useApiKey } from '../hooks/useApiKey'
import { useChat } from '../hooks/useChat'

export function Chat() {
  const { apiKey, isValidating, validateAndSetApiKey, clearApiKey } = useApiKey()
  const { messages, isLoading, sendMessage } = useChat(apiKey)
  const [input, setInput] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [keyError, setKeyError] = useState('')

  if (!apiKey) {
    const handleKeySubmit = async (e: FormEvent) => {
      e.preventDefault()
      if (!keyInput.trim()) return
      setKeyError('')
      const isValid = await validateAndSetApiKey(keyInput.trim())
      if (!isValid) setKeyError('Clé API invalide')
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 animate-message-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">Entrez votre clé API Mistral</p>
          <form onSubmit={handleKeySubmit} className="flex flex-col gap-3">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Votre clé API..."
              disabled={isValidating}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 dark:bg-gray-700/50 transition-all duration-200 disabled:opacity-50"
            />
            {keyError && <p className="text-red-500 text-sm text-center">{keyError}</p>}
            <button
              type="submit"
              disabled={!keyInput.trim() || isValidating}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isValidating ? 'Validation...' : 'Valider'}
            </button>
          </form>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-6 text-center">
            Obtenez votre clé sur <span className="text-indigo-500">console.mistral.ai</span>
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <header className="p-4 border-b border-white/20 backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-xl">🤖</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Johan Mistral Chat</h1>
        </div>
        <button
          type="button"
          onClick={clearApiKey}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
        >
          Changer de clé
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-message-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Commencez une conversation</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Posez une question à Mistral AI</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[80%] shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-md'
                  : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/20 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start animate-message-in">
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/20 p-4 rounded-2xl rounded-bl-md shadow-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full typing-dot"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full typing-dot"></span>
              </div>
            </div>
          </div>
        )}
      </main>

      <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 backdrop-blur-lg bg-white/70 dark:bg-gray-800/70">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Votre message..."
            disabled={isLoading}
            className="flex-1 px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 dark:bg-gray-700/50 disabled:opacity-50 transition-all duration-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              Envoyer
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
