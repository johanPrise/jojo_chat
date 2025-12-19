'use client'

import { useState, FormEvent } from "react"
import { useChat } from "../hooks/useChat"


export function Chat(){
    const {messages, isLoading, sendMessage } = useChat()
    const [input, setInput] = useState('')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if(!input.trim()) return
        sendMessage(input)
        setInput('')
    }

    return(
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            <header className="p-4 border-b">
                <h1 className="text-xl font-semibold">Chat Jojo Avec Mistral API</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <p className="text-center text-gray-500">Commencer une conversation</p>
                )}
                {
                    messages.map((msg, i) =>(
                        <div key={i}
                        className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user'
                            ? 'bg-blue-500 text-white ml-auto'
                            :'bg-gray-200 dark:bg-gray-700' 
                        }`}>
                            {msg.content}
                        </div>
                    ))
                }
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-[80%]">
                        <span className="animate-pulse">...</span>
                    </div>
                )}
            </main>

            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:bg-blue-500 disabled:opacity-50"/>
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Envoyer
                    </button>
            </form>
        </div>
    )

}