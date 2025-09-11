'use client'

import React, { useState, useRef, useEffect } from 'react'
import { X, Send, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import { Button, Card } from '@/components/ui'

interface Message {
  id: string
  text: string
  sender: 'user' | 'jumo'
  timestamp: Date
}

interface JumoChatProps {
  restaurantName: string
}

export default function JumoChat({ restaurantName }: JumoChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 초기 인사 메시지
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `안녕하세요, ${restaurantName} 사장님! 🍺\n\n주모입니다. 매장 운영에 대한 분석과 조언이 필요하시면 언제든 말씀해주세요!\n\n💡 이런 것들을 도와드릴 수 있어요:\n• 📊 매출 분석 및 트렌드\n• 👥 고객 행동 패턴 분석\n• 📅 예약 최적화 제안\n• ⭐ 리뷰 요약 및 개선점\n• 🎯 마케팅 전략 제안`,
        sender: 'jumo',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, restaurantName])

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 주모 응답 생성
  const generateJumoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('매출') || lowerMessage.includes('수익')) {
      return '📊 **매출 분석 리포트**\n\n이번 주 매출 트렌드를 분석해보니:\n\n• **주말 매출**이 평일 대비 40% 높습니다\n• **저녁 7시~9시** 시간대가 가장 수익성이 좋아요\n• 작년 동월 대비 **15% 성장** 중입니다\n\n💡 **제안사항:**\n평일 오후 시간대 할인 이벤트를 통해 매출 극대화를 추천드려요!'
    }
    
    if (lowerMessage.includes('고객') || lowerMessage.includes('손님')) {
      return '👥 **고객 분석 인사이트**\n\n최근 한 달 고객 데이터 분석 결과:\n\n• **20-30대 여성** 고객이 45% 차지\n• **재방문율** 68% (업계 평균 55%)\n• **평균 머무는 시간** 90분\n\n✨ **주목할 점:**\n"분위기 좋다", "친절하다"는 리뷰가 많아요. 이 강점을 활용한 마케팅을 추천합니다!'
    }
    
    if (lowerMessage.includes('예약') || lowerMessage.includes('시간')) {
      return '📅 **예약 패턴 분석**\n\n최근 예약 데이터를 보면:\n\n• **금요일 저녁**이 가장 인기 (예약률 95%)\n• **화요일 오후**가 가장 한가함 (35%)\n• **노쇼율** 8% (업계 평균 12%보다 양호)\n\n🎯 **운영 제안:**\n한가한 시간대에 "오피스 런치" 프로모션이나 "애프터눈 티" 메뉴로 매출 보완하세요!'
    }
    
    if (lowerMessage.includes('리뷰') || lowerMessage.includes('평점')) {
      return '⭐ **리뷰 분석 요약**\n\n최근 30일 리뷰 키워드 분석:\n\n**👍 긍정 키워드:**\n• "맛있다" (87%)\n• "친절하다" (72%)\n• "분위기 좋다" (65%)\n\n**👎 개선점:**\n• "대기시간" 관련 언급 증가\n• "주차" 어려움 지적 3건\n\n💡 **액션 플랜:**\n웨이팅 시스템 도입과 주차 안내를 강화하시면 평점이 더 올라갈 거예요!'
    }
    
    if (lowerMessage.includes('마케팅') || lowerMessage.includes('프로모션')) {
      return '🎯 **마케팅 전략 제안**\n\n현재 매장 상황에 맞는 추천:\n\n**📱 SNS 마케팅:**\n• 인스타그램 "오늘의 메뉴" 포스팅\n• 고객 방문 인증샷 이벤트\n\n**🎁 프로모션 아이디어:**\n• 화요일 "조용한 데이트" 20% 할인\n• 생일 고객 특별 디저트 서비스\n• 단골고객 스탬프 제도\n\n**예상 효과:** 신규 고객 30% 증가 가능!'
    }
    
    if (lowerMessage.includes('안녕') || lowerMessage.includes('hi')) {
      return `반가워요 사장님! 🍺\n\n오늘도 ${restaurantName} 운영하시느라 고생 많으세요. 매장 운영에 관해 궁금한 게 있으시면 언제든 물어보세요!\n\n제가 데이터 분석부터 마케팅 아이디어까지 모두 도와드릴게요! 💪`
    }
    
    if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
      return '🎯 **주모가 제공하는 서비스**\n\n**📊 데이터 분석:**\n• 매출 및 수익 트렌드 분석\n• 고객 행동 패턴 파악\n• 시간대별 운영 효율성 진단\n\n**💡 운영 컨설팅:**\n• 메뉴 구성 최적화 제안\n• 인력 운영 효율화 방안\n• 비용 절감 아이디어\n\n**🎪 마케팅 지원:**\n• 타겟 고객층 분석\n• 프로모션 기획 및 효과 측정\n• 경쟁사 대비 포지셔닝\n\n어떤 도움이 필요하신가요?'
    }
    
    return '음... 조금 더 구체적으로 말씀해주시면 더 정확한 분석을 도와드릴 수 있어요! 🤔\n\n예를 들어:\n• "이번 달 매출이 궁금해"\n• "고객들 반응이 어때?"\n• "예약 시간 최적화하고 싶어"\n• "리뷰 분석해줘"\n• "마케팅 아이디어 줘"\n\n이런 식으로 말씀해주세요!'
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

    // 주모 응답 시뮬레이션
    setTimeout(() => {
      const response = generateJumoResponse(inputText.trim())
      const jumoMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'jumo',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, jumoMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000) // 1.5-2.5초 랜덤 지연
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* 주모 아이콘 버튼 */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-muted-blue hover:bg-muted-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="sm"
      >
        <span className="text-lg mr-2">🍺</span>
        <span className="font-medium">주모에게 물어보기</span>
      </Button>

      {/* 오버레이 채팅 창 */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl h-[80vh] flex flex-col">
            
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-muted-blue/5">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🍺</span>
                <div>
                  <div className="font-bold text-brown-900 text-lg">주모 - AI 매장 비서</div>
                  <div className="text-sm text-gray-600">{restaurantName} 전용 컨설턴트</div>
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

            <div className="flex flex-1 overflow-hidden">
              {/* 사이드바 - 빠른 액션 */}
              <div className="w-64 border-r border-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-brown-900 mb-4">💡 빠른 질문</h3>
                <div className="space-y-2">
                  {[
                    { icon: '📊', text: '매출 분석해줘', query: '이번 달 매출이 궁금해' },
                    { icon: '👥', text: '고객 분석', query: '고객들 반응이 어때?' },
                    { icon: '📅', text: '예약 패턴', query: '예약 시간 최적화하고 싶어' },
                    { icon: '⭐', text: '리뷰 요약', query: '리뷰 분석해줘' },
                    { icon: '🎯', text: '마케팅 아이디어', query: '마케팅 아이디어 줘' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(item.query)
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors text-sm"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.text}
                    </button>
                  ))}
                </div>

                {/* 통계 요약 */}
                <div className="mt-6 p-3 bg-white rounded-lg">
                  <h4 className="font-medium text-brown-900 text-sm mb-2">📈 오늘의 요약</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>예약:</span>
                      <span className="font-medium">24건</span>
                    </div>
                    <div className="flex justify-between">
                      <span>완료:</span>
                      <span className="font-medium text-green-600">18건</span>
                    </div>
                    <div className="flex justify-between">
                      <span>대기:</span>
                      <span className="font-medium text-yellow-600">6건</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상매출:</span>
                      <span className="font-medium text-blue-600">450K</span>
                    </div>
                  </div>
                </div>
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
                            ? 'bg-muted-blue text-white'
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
                          <span className="text-lg">🍺</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">분석 중...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="매장 운영에 대해 궁금한 것을 물어보세요... (예: 매출 분석해줘)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-muted-blue/20"
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
        </div>
      )}
    </>
  )
}