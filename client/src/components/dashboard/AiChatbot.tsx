import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Minus, Plus, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AiChatbotProps {
  selectedRequest?: any;
  allRequests?: any[];
}

export function AiChatbot({ selectedRequest, allRequests = [] }: AiChatbotProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Ask me about margin impacts, customer analysis, or regional comparisons!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'What\'s the total margin impact if I approve all requests?',
    'Show me Wire Rod performance vs Oman average',
    'What\'s the risk of approving all high-value requests?'
  ];

  const generateBotResponse = (message: string): string => {
    const msg = message.toLowerCase();
    
    if (msg.includes('total') && msg.includes('impact')) {
      const totalImpact = allRequests.reduce((sum, req) => sum + (req.orderValue * req.discount / 100), 0);
      const highPriorityRequests = allRequests.filter(req => req.priority === 'High');
      const mediumPriorityRequests = allRequests.filter(req => req.priority === 'Medium');
      const lowPriorityRequests = allRequests.filter(req => req.priority === 'Low');
      
      const highImpact = highPriorityRequests.reduce((sum, req) => sum + (req.orderValue * req.discount / 100), 0);
      const mediumImpact = mediumPriorityRequests.reduce((sum, req) => sum + (req.orderValue * req.discount / 100), 0);
      const lowImpact = lowPriorityRequests.reduce((sum, req) => sum + (req.orderValue * req.discount / 100), 0);
      
      return `**Total Margin Impact Analysis:**
• All ${allRequests.length} requests: -OMR ${Math.round(totalImpact).toLocaleString()}
• High priority (${highPriorityRequests.length}): -OMR ${Math.round(highImpact).toLocaleString()}
• Medium priority (${mediumPriorityRequests.length}): -OMR ${Math.round(mediumImpact).toLocaleString()}
• Low priority (${lowPriorityRequests.length}): -OMR ${Math.round(lowImpact).toLocaleString()}
⚠️ This represents ${((totalImpact / 5500000) * 100).toFixed(1)}% of monthly revenue.`;
    }
    
    if (msg.includes('wire rod') && msg.includes('performance')) {
      const wireRodRequests = allRequests.filter(req => req.product === 'Wire Rod');
      const avgDiscount = wireRodRequests.reduce((sum, req) => sum + req.discount, 0) / wireRodRequests.length;
      
      return `**Wire Rod Performance vs Oman Average:**
• Oman Avg Discount: 12.5%
• Current Requests: ${avgDiscount.toFixed(1)}% avg
• Performance: +18% above regional demand
• Inventory Status: Low (2,450 MT)
💡 Consider premium pricing due to high demand.`;
    }
    
    if (msg.includes('risk') && (msg.includes('high') || msg.includes('all'))) {
      const highValueRequests = allRequests.filter(req => req.orderValue > 400000);
      const totalValue = highValueRequests.reduce((sum, req) => sum + req.orderValue, 0);
      const totalImpact = highValueRequests.reduce((sum, req) => sum + (req.orderValue * req.discount / 100), 0);
      
      return `**Risk Assessment - High Value Requests:**
• ${highValueRequests.length} requests >OMR 400K = OMR ${(totalValue / 1000000).toFixed(2)}M total
• Combined margin impact: -OMR ${Math.round(totalImpact / 1000)}K
• Risk Level: ${totalImpact > 200000 ? 'HIGH ⚠️' : 'MEDIUM ⚡'}
• Recommendation: Stagger approvals across 2 months
• Alternative: Counter with 12-14% discount.`;
    }
    
    if (msg.includes('20%') || (msg.includes('margin') && selectedRequest)) {
      const customer = selectedRequest ? selectedRequest.customer : 'selected customer';
      const impact = selectedRequest ? (selectedRequest.orderValue * 0.20) : 90000;
      
      return `**20% Discount Impact for ${customer}:**
• Margin reduction: -OMR ${Math.round(impact).toLocaleString()}
• New margin: ${selectedRequest ? (selectedRequest.originalMargin * 0.8).toFixed(1) : '18.0'}%
• Risk: ${impact > 80000 ? 'HIGH' : 'MEDIUM'}
• Recommendation: Consider 15% maximum.`;
    }

    if (msg.includes('approve') || msg.includes('recommendation')) {
      if (selectedRequest) {
        const riskLevel = selectedRequest.discount > 20 ? 'HIGH' : selectedRequest.discount > 15 ? 'MEDIUM' : 'LOW';
        const recommendation = selectedRequest.discount > 20 ? 'Reject or counter-offer' : 
                             selectedRequest.discount > 15 ? 'Approve with conditions' : 'Safe to approve';
        
        return `**Recommendation for ${selectedRequest.customer}:**
• Product: ${selectedRequest.product}
• Requested Discount: ${selectedRequest.discount}%
• Risk Level: ${riskLevel}
• Recommendation: ${recommendation}
• Suggested Action: ${selectedRequest.discount > 18 ? 'Counter with 15% max' : 'Approve as requested'}`;
      }
    }
    
    return 'I can help with margin analysis, customer insights, and regional comparisons. Try asking about specific discount impacts, total monthly effects, or product performance comparisons.';
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    const botResponse = generateBotResponse(inputValue);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 z-50">
      <div className="bg-white rounded-lg shadow-lg border">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
          <h4 className="font-semibold text-sm flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            AI Assistant
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-gray-200 hover:bg-blue-700 h-6 w-6 p-0"
          >
            {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {/* Chat Content */}
        {isExpanded && (
          <div className="p-3">
            {/* Messages */}
            <div className="h-48 overflow-y-auto mb-3 border rounded p-2 bg-gray-50 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${message.isUser ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block px-2 py-1 rounded text-xs max-w-xs ${
                      message.isUser
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text.split('\n').map((line, index) => (
                      <div key={index}>
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong>{line.slice(2, -2)}</strong>
                        ) : line.startsWith('•') ? (
                          <div className="ml-2">{line}</div>
                        ) : (
                          line
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-xs"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 px-3"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs px-2 py-1 h-auto bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  {question.length > 20 ? question.substring(0, 20) + '...' : question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}