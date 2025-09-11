'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  text: string
  sender: 'user' | 'dolsoe'
  timestamp: Date
}

export default function DolsoeChat() {
  const { user, isLoggedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 초기 인사 메시지
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: isLoggedIn 
          ? `안녕하세요 ${user?.name}님! 돌쇠입니다 🤖\n\n예약 문의나 맛집 추천이 필요하시면 언제든 말씀해주세요!`
          : '안녕하세요! 돌쇠입니다 🤖\n\n로그인하시면 더 개인화된 서비스를 제공해드릴 수 있어요!',
        sender: 'dolsoe',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, isLoggedIn, user?.name])

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 돌쇠 응답 생성
  const generateDolsoeResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('예약') || lowerMessage.includes('예야')) {
      return '예약 관련 도움이 필요하시군요! 🍽️\n\n어떤 매장을 찾고 계신가요? 지역, 음식 종류, 인원수를 알려주시면 더 정확한 추천을 드릴 수 있어요!'
    }
    
    if (lowerMessage.includes('추천') || lowerMessage.includes('맛집')) {
      return '맛집 추천을 원하시는군요! 😋\n\n• 지역은 어디인가요?\n• 어떤 음식을 드시고 싶으신가요?\n• 몇 명이서 가실 예정인가요?\n• 예산대는 어느 정도를 생각하고 계신가요?'
    }
    
    if (lowerMessage.includes('안녕') || lowerMessage.includes('hi')) {
      return `반가워요! ${isLoggedIn ? user?.name + '님' : ''} 🙋‍♂️\n\n저는 자리매의 AI 도우미 돌쇠예요. 예약이나 맛집 추천이 필요하시면 언제든 말씀해주세요!`
    }
    
    if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
      return '제가 도와드릴 수 있는 것들이에요! ✨\n\n🍽️ 매장 예약 도움\n🎯 맛집 추천\n📍 지역별 인기 매장 안내\n⭐ 리뷰 기반 매장 정보\n💡 예약 팁 제공\n\n무엇이 필요하신가요?'
    }
    
    return '죄송해요, 잘 이해하지 못했어요 😅\n\n저는 예약 도움과 맛집 추천이 전문이에요! "예약", "추천", "도움"과 같은 키워드로 말씀해주시면 더 잘 도와드릴 수 있어요.'
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // 돌쇠 응답 시뮬레이션
    setTimeout(() => {
      const response = generateDolsoeResponse(inputText.trim())
      const dolsoeMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'dolsoe',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, dolsoeMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2초 랜덤 지연
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-hazelnut hover:bg-hazelnut/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          size="sm"
        >
          <span className="text-xl">🤖</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl h-[80vh] flex flex-col">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-hazelnut/5">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-bold text-brown-900 text-lg">돌쇠 - AI 예약 도우미</div>
              <div className="text-sm text-gray-600">맛집 예약과 추천을 도와드려요</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="border-0 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-line ${
                      message.sender === 'user'
                        ? 'bg-hazelnut text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🤖</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">답변 준비 중...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 추천 질문 */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">💡 이런 질문은 어떠세요?</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    '예약하고 싶어요',
                    '맛집 추천해줘',
                    '강남 한식당이 어디예요?',
                    '인기 매장 보여줘',
                    '도움이 필요해요'
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(question)
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-hazelnut/10 border border-gray-200 hover:border-hazelnut/30 rounded-full text-sm text-gray-600 hover:text-hazelnut transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 입력 영역 */}
              <div className="flex space-x-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="예약 문의나 맛집 추천을 요청해보세요..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-hazelnut/20 bg-white"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="px-6 py-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}