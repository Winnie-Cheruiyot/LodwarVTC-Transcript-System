import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the LVTC assistant. I can help you with questions about our courses, transcripts, and general information. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const faqData = [
    {
      question: "What courses are available at LVTC?",
      answer: "We offer 10 technical courses: Motor Vehicles Mechanics, Carpentry and Joinery, Arc Welding, Masonry and Building Technology, Fashion Design and Garment Making, Information Communication Technology, Hairdressing and Beauty Therapy, Electrical Wireman, Plumbing and Pipe Fitting Technology, and Food Processing and Beverage."
    },
    {
      question: "How do I generate a transcript?",
      answer: "You can generate a transcript in two ways: 1) Upload a CSV file with student data using our Excel uploader, or 2) Manually enter student information and course units in the transcript form. Both options are available on the Generator page."
    },
    {
      question: "What information is included in a transcript?",
      answer: "Our transcripts include student name, admission number, course name, school year, and detailed course units with CAT scores, exam scores, total marks, and grades. Each transcript also includes our institutional logo and official formatting."
    },
    {
      question: "How is grading calculated?",
      answer: "Grading is calculated based on total marks: A (70-100), B (60-69), C (50-59), D (40-49), E (0-39). The total is the sum of CAT and Exam scores for each course unit."
    },
    {
      question: "Can I download transcript templates?",
      answer: "Yes! On the Generator page, you can download a CSV template that shows the exact format needed for bulk transcript uploads. The template includes sample data to guide you."
    },
    {
      question: "What course units are assessed?",
      answer: "All courses include these core units: Trade Theory, Trade Practice, Communication Skills, Entrepreneurship, Mathematics, General Science, Digital Literacy, and Life Skills."
    },
    {
      question: "How do I view analytics and reports?",
      answer: "Visit the Dashboard page to view comprehensive analytics including overall statistics, top students, course performance metrics, pass rates, and detailed course analytics for all available programs."
    },
    {
      question: "Is there a limit to how many transcripts I can generate?",
      answer: "No, there's no limit. You can generate individual transcripts or batch process multiple students using our CSV upload feature."
    }
  ];

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Course-related queries
    if (message.includes("course") || message.includes("program")) {
      return "We offer 10 technical courses at LVTC: Motor Vehicles Mechanics, Carpentry and Joinery, Arc Welding, Masonry and Building Technology, Fashion Design and Garment Making, Information Communication Technology, Hairdressing and Beauty Therapy, Electrical Wireman, Plumbing and Pipe Fitting Technology, and Food Processing and Beverage. Which course would you like to know more about?";
    }
    
    // Transcript-related queries
    if (message.includes("transcript") || message.includes("generate")) {
      return "To generate a transcript, go to the Generator page where you can either upload a CSV file with student data or manually enter the information. The transcript will include student details, course information, and all assessed units with grades.";
    }
    
    // Grading queries
    if (message.includes("grade") || message.includes("grading") || message.includes("marks")) {
      return "Our grading system works as follows: A (70-100 marks), B (60-69), C (50-59), D (40-49), E (0-39). The total mark is calculated by adding CAT and Exam scores for each course unit.";
    }
    
    // Analytics queries
    if (message.includes("dashboard") || message.includes("analytics") || message.includes("report")) {
      return "The Dashboard provides comprehensive analytics including overall statistics, top student rankings, course performance metrics, and pass rates. You can track student progress and course effectiveness through detailed charts and data.";
    }
    
    // General help
    if (message.includes("help") || message.includes("how")) {
      return "I can help you with information about our courses, transcript generation, grading system, and using the dashboard. You can also check the FAQ section below for common questions. What specific topic would you like assistance with?";
    }
    
    // Contact/admission queries
    if (message.includes("contact") || message.includes("admission") || message.includes("apply")) {
      return "For admission information and contact details, please visit our main office at Lodwar Vocational Training Centre. I can help you with technical questions about our courses and the transcript system here.";
    }
    
    // Default response
    return "I'd be happy to help! I can provide information about our courses, transcript generation, grading system, and dashboard analytics. Could you please be more specific about what you'd like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);

    toast.success("Message sent!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3">
            <Bot className="w-10 h-10" />
            LVTC Assistant
          </h1>
          <p className="text-lg text-blue-700">
            Get instant help with courses, transcripts, and general information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Chat with LVTC Assistant
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                          message.isBot ? "justify-start" : "justify-end"
                        }`}
                      >
                        {message.isBot && (
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? "bg-white border text-gray-800"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        {!message.isBot && (
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="bg-white border p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-sm">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Tips</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2">Courses</Badge>
                    <Badge variant="secondary" className="mr-2">Transcripts</Badge>
                    <Badge variant="secondary" className="mr-2">Grading</Badge>
                    <Badge variant="secondary" className="mr-2">Dashboard</Badge>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Click on any badge topic to get quick information!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;