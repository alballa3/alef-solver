import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Settings2, 
  Bot, 
  CircleHelp, 
  Brain, 
  Copy,
  RotateCcw,
  GripHorizontal,
  Minimize,
  Maximize,
  Send,
  CheckCircle,
  Lightbulb,
  X,
  AlertTriangle
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from './components/info';
import { Settings } from './components/settings/settings';

// Define types for better type safety
type NotificationType = "success" | "error" | "info";
type ApiType = "deepseek" | "chatgpt";

interface Position {
  x: number;
  y: number;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType;
}

const App = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [apiChoice, setApiChoice] = useState<ApiType>("deepseek");
  const [saveKey, setSaveKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("How can I improve the performance of my React application?");
  const [notification, setNotification] = useState<NotificationState>({ 
    show: false, 
    message: "", 
    type: "success" 
  });
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("solver");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [editingQuestion, setEditingQuestion] = useState(false);
  
  const appRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Show notification with type
  const showNotification = (message: string, type: NotificationType = "success") => {
    setNotification({ show: true, message, type });
    
    // Automatically hide notification
    const timer = setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
    
    return () => clearTimeout(timer);
  };
  
  // Load saved API key on component mount or when API choice changes
  useEffect(() => {
    const savedKey = localStorage.getItem(`${apiChoice}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
      setSaveKey(true);
    } else {
      setApiKey("");
    }
  }, [apiChoice]);
  
  // Handle loading animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return 90; // Cap at 90% until actually complete
          return prev + 10;
        });
      }, 300);
    } else {
      setLoadingProgress(loading ? 90 : 0);
    }
    
    return () => clearInterval(interval);
  }, [loading]);
  
  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y)
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  // Focus textarea when editing
  useEffect(() => {
    if (editingQuestion && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingQuestion]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel editing
      if (e.key === 'Escape' && editingQuestion) {
        setEditingQuestion(false);
      }
      
      // Ctrl+Enter to submit
      if (e.key === 'Enter' && e.ctrlKey && !loading && activeTab === 'solver' && !showAnswer) {
        handleSolve();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingQuestion, loading, activeTab, showAnswer]);
  
  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (appRef.current) {
      const rect = appRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };
  
 
  
  // Handle question solving
  const handleSolve = async () => {
    if (!question.trim()) {
      showNotification("Please enter a question", "error");
      return;
    }
    
    if (!apiKey) {
      showNotification("API key required", "error");
      setActiveTab("settings");
      return;
    }
    
    setLoading(true);
    setLoadingProgress(10);
    setEditingQuestion(false);
    
    // For demo purposes - simulated API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnswer(`Here's the answer to your question about React performance:

1. Use React.memo for components that render often with the same props
2. Implement useCallback for functions passed as props
3. Utilize useMemo for expensive calculations
4. Virtualize long lists with react-window or react-virtualized
5. Use proper key props in lists
6. Code-split with React.lazy and Suspense
7. Avoid unnecessary re-renders

These optimizations will significantly enhance your app's performance.`);
      
      setLoading(false);
      setLoadingProgress(100);
      setShowAnswer(true);
    } catch (error) {
      showNotification("Failed to get answer", "error");
      setLoading(false);
      setLoadingProgress(0);
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setShowAnswer(false);
    setLoadingProgress(0);
    setEditingQuestion(false);
  };
  
  // Copy text to clipboard
  const copyToClipboard = (text: string, message: string = "Copied to clipboard") => {
    navigator.clipboard.writeText(text)
      .then(() => showNotification(message))
      .catch(() => showNotification("Failed to copy", "error"));
  };
  
  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  // Getting the API brand name
  const getBrandName = () => apiChoice === "deepseek" ? "DeepSeek" : "OpenAI";
  
  // Render notification based on type
   const renderNotification = () => {
    if (!notification.show) return null;
    
    const bgColors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500"
    };
    
    const icons = {
      success: <CheckCircle className="w-3 h-3" />,
      error: <AlertTriangle className="w-3 h-3" />,
      info: <CircleHelp className="w-3 h-3" />
    };
    
    return (
      <div className={`px-3 py-1.5 text-white text-xs font-medium flex items-center gap-1.5 ${bgColors[notification.type]}`}>
        {icons[notification.type]}
        {notification.message}
      </div>
    );
  };
  
  return (
    <div 
      ref={appRef}
      className="fixed shadow-lg rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 ease-in-out"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: isMinimized ? '300px' : '360px',
        maxHeight: isMinimized ? '60px' : '520px',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        zIndex: 9999
      }}
    >
      {/* Draggable header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-3 py-2.5 flex items-center justify-between cursor-move select-none"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-1.5">
          <Bot className="w-4 h-4" />
          <span className="font-medium text-sm">Alef Solver</span>
          <Badge variant="outline" className="text-xs font-normal ml-1 text-blue-100 border-blue-400 px-1.5 py-0">
            {getBrandName()}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-3.5 h-3.5 text-blue-200 opacity-60" />
          <button 
            onClick={toggleMinimize}
            className="text-white hover:text-blue-200 focus:outline-none transition-colors p-1"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize className="w-3.5 h-3.5" /> : <Minimize className="w-3.5 h-3.5" />}
          </button>
          {!isMinimized && (
            <button 
              className="text-white hover:text-blue-200 focus:outline-none transition-colors p-1"
              onClick={() => window.close()}
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Loading progress indicator */}
      {loading && (
        <div className="h-0.5 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-0.5 bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
            role="progressbar"
            aria-valuenow={loadingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
      
      {/* Notification */}
      {renderNotification()}
      
      {/* App content */}
      {!isMinimized && (
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="solver" className="text-xs flex items-center gap-1.5">
                <MessageSquare className="w-3 h-3" />
                Solver
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs flex items-center gap-1.5">
                <Settings2 className="w-3 h-3" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="help" className="text-xs flex items-center gap-1.5">
                <CircleHelp className="w-3 h-3" />
                Help
              </TabsTrigger>
            </TabsList>
            
            {/* Solver Tab */}
            <TabsContent value="solver" className="p-3 space-y-4 overflow-auto max-h-96">
              {!showAnswer ? (
                <div className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-blue-600" />
                        Current Question
                      </h3>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setEditingQuestion(!editingQuestion)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                aria-label="Edit question"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                </svg>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">Edit question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyToClipboard(question, "Question copied")}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                aria-label="Copy question"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">Copy question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {editingQuestion ? (
                      <Textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="text-xs min-h-20 resize-none"
                        placeholder="Enter your question here..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            e.preventDefault();
                            handleSolve();
                          }
                        }}
                      />
                    ) : (
                      <div 
                        className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md border text-xs min-h-12 max-h-24 overflow-y-auto"
                        onClick={() => setEditingQuestion(true)}
                      >
                        {question}
                      </div>
                    )}
                    
                    {editingQuestion && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">Tip:</span>
                        <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border rounded">Ctrl</kbd>
                        <span className="mx-1">+</span>
                        <kbd className="px-1 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border rounded">Enter</kbd>
                        <span className="ml-1">to submit</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={handleSolve} 
                      className="w-full py-1.5 h-auto text-sm bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1.5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-1"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          Get Answer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      Answer
                    </h3>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyToClipboard(answer)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              aria-label="Copy answer"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Copy to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleReset}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              aria-label="Ask another question"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p className="text-xs">Ask another question</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800 text-xs max-h-64 overflow-y-auto whitespace-pre-wrap">
                    {answer}
                  </div>
                  
                  <Button 
                    onClick={handleReset} 
                    variant="outline"
                    className="w-full py-1 h-auto text-xs"
                  >
                    Ask Another Question
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="p-3 space-y-4">
              <Settings/>
            </TabsContent>
            
            {/* Help Tab */}
            <TabsContent value="help" className="p-3 space-y-3 text-xs overflow-y-auto max-h-96">
             <Info />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default App;