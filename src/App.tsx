import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Settings2, 
  Bot, 
  Key, 
  CircleHelp, 
  Brain, 
  ArrowRight,
  Copy,
  RotateCcw,
  GripHorizontal,
  Minimize,
  Maximize,
  Send,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const App = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [apiChoice, setApiChoice] = useState("deepseek");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saveKey, setSaveKey] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const appRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Show notification
  const showNotification = (message: string, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3000);
  };
  
  // Load saved API key and recent questions on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem(`${apiChoice}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
      setSaveKey(true);
    }
    
    const savedQuestions = localStorage.getItem('recent_questions');
    if (savedQuestions) {
      setRecentQuestions(JSON.parse(savedQuestions).slice(0, 5));
    }
  }, [apiChoice]);
  
  // Handle loading animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            return 90; // Cap at 90% until actually complete
          }
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
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
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
  
  // Save settings to local storage
  const saveSettings = () => {
    if (saveKey && apiKey) {
      localStorage.setItem(`${apiChoice}_api_key`, apiKey);
      showNotification("Settings saved successfully!");
    } else if (!saveKey) {
      localStorage.removeItem(`${apiChoice}_api_key`);
      showNotification("Settings updated - API key will not be saved locally");
    } else {
      showNotification("Please enter a valid API key", "error");
    }
  };
  
  // Handle API model change
  const handleApiChange = (value: string) => {
    setApiChoice(value);
    const savedKey = localStorage.getItem(`${value}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
      setSaveKey(true);
    } else {
      setApiKey("");
    }
  };
  
  // Handle question solving
  const handleSolve = async () => {
    if (!question.trim()) {
      showNotification("Please enter a question first", "error");
      return;
    }
    
    if (!apiKey) {
      showNotification("API key required - check Settings tab", "error");
      return;
    }
    
    setLoading(true);
    setLoadingProgress(0);
    
    // Save to recent questions
    const updatedRecentQuestions = [question, ...recentQuestions.filter(q => q !== question)].slice(0, 5);
    setRecentQuestions(updatedRecentQuestions);
    localStorage.setItem('recent_questions', JSON.stringify(updatedRecentQuestions));
    
    // In a real implementation, you would call the actual API here
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAnswer(`Here's the answer to your question: "${question}"\n\nThis is where the AI-generated response from ${apiChoice === "deepseek" ? "DeepSeek" : "ChatGPT"} would appear after processing your query. The content would be tailored to your specific question and provide a comprehensive response using the latest AI technology.`);
      setLoading(false);
      setLoadingProgress(100);
      setShowAnswer(true);
    } catch (error) {
      showNotification("Failed to get an answer. Please try again.", "error");
      setLoading(false);
      setLoadingProgress(0);
    }
  };
  
  // Use a recent question
  const useRecentQuestion = (q: string) => {
    setQuestion(q);
    if (questionInputRef.current) {
      questionInputRef.current.focus();
    }
  };
  
  // Reset the form
  const handleReset = () => {
    setShowAnswer(false);
    setQuestion("");
    setAnswer("");
    setLoadingProgress(0);
  };
  
  // Copy answer to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    showNotification("Answer copied to clipboard!");
  };
  
  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <div 
      ref={appRef}
      className="fixed shadow-xl rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: isMinimized ? 'auto' : 'min(95vw, 50rem)',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        zIndex: 9999
      }}
    >
      {/* Draggable header */}
      <div 
        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Alef Solver</span>
          <Badge variant="outline" className="text-xs font-normal ml-2 text-blue-100 border-blue-400">
            {apiChoice === "deepseek" ? "DeepSeek" : "ChatGPT"}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <GripHorizontal className="w-4 h-4 text-blue-200 opacity-60" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleMinimize}
                  className="text-white hover:text-blue-200 focus:outline-none transition-colors"
                >
                  {isMinimized ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMinimized ? "Expand" : "Minimize"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Loading progress indicator */}
      {loading && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-1 bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
      
      {/* Notification */}
      {notification.show && (
        <div 
          className={`px-4 py-2 text-white text-sm font-medium flex items-center gap-2 ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {notification.type === 'error' ? 
            <span className="text-white">⚠️</span> : 
            <CheckCircle className="w-4 h-4" />
          }
          {notification.message}
        </div>
      )}
      
      {/* App content */}
      {!isMinimized && (
        <Tabs defaultValue="solver" className="p-4">
          <TabsList className="flex w-full p-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TabsTrigger value="solver" className="flex-1 flex items-center justify-center gap-2 py-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Solver</span>
            </TabsTrigger>
            <TabsTrigger id="settings-tab" value="settings" className="flex-1 flex items-center justify-center gap-2 py-3">
              <Settings2 className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex-1 flex items-center justify-center gap-2 py-3">
              <CircleHelp className="w-4 h-4" />
              <span className="font-medium">Help</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="solver" className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>AI Question Solver</span>
                </CardTitle>
                <CardDescription>
                  Get instant, accurate answers powered by {apiChoice === "deepseek" ? "DeepSeek" : "ChatGPT"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 pt-4">
                {!showAnswer ? (
                  <div className="flex flex-col py-3 space-y-5">
                    <div className="w-full relative">
                      <Textarea 
                        ref={questionInputRef}
                        placeholder="What would you like to know?"
                        className="min-h-28 w-full pr-12 resize-none text-base"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            handleSolve();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSolve}
                        disabled={loading || !question.trim()}
                        className="absolute right-3 bottom-3 p-2 h-auto w-auto rounded-full"
                        variant="ghost"
                      >
                        <Send className="w-5 h-5 text-blue-600" />
                      </Button>
                    </div>
                    
                    {recentQuestions.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xs text-gray-500 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> RECENT QUESTIONS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recentQuestions.map((q, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs truncate max-w-full"
                              onClick={() => useRecentQuestion(q)}
                            >
                              {q.length > 30 ? q.substring(0, 30) + '...' : q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3 items-center mt-4">
                      <Button 
                        onClick={handleSolve} 
                        className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-lg"
                        disabled={loading || !question.trim()}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-pulse">Analyzing</span>
                            <span className="flex gap-1">
                              <span className="animate-bounce delay-0">.</span>
                              <span className="animate-bounce delay-100">.</span>
                              <span className="animate-bounce delay-200">.</span>
                            </span>
                          </span>
                        ) : "Get Answer"}
                      </Button>
                      
                      <p className="text-sm text-gray-500">
                        Press Ctrl+Enter to submit
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" /> YOUR QUESTION
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">{question}</p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                          <Brain className="w-4 h-4" /> AI ANSWER
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={copyToClipboard} 
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 h-8"
                        >
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{answer}</p>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="flex items-center gap-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> New Question
                      </Button>
                      
                      <Button 
                        variant="default" 
                        onClick={() => setShowAnswer(false)}
                        className="flex items-center gap-1"
                      >
                        Edit Question <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  API Settings
                </CardTitle>
                <CardDescription>
                  Configure your preferred AI model and API key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Choose AI Model</Label>
                  <RadioGroup 
                    value={apiChoice}
                    onValueChange={handleApiChange}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="deepseek" id="deepseek" />
                      <Label htmlFor="deepseek" className="font-normal cursor-pointer flex-1">
                        <span className="text-sm font-medium">DeepSeek AI</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Optimized for technical and academic questions</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="chatgpt" id="chatgpt" />
                      <Label htmlFor="chatgpt" className="font-normal cursor-pointer flex-1">
                        <span className="text-sm font-medium">ChatGPT</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Better for conversational and general knowledge</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="api-key" className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-gray-400" />
                    {apiChoice === "deepseek" ? "DeepSeek" : "ChatGPT"} API Key
                  </Label>
                  <Input 
                    id="api-key"
                    type="password" 
                    placeholder={`Enter your ${apiChoice === "deepseek" ? "DeepSeek" : "OpenAI"} API key`}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get your key from the {apiChoice === "deepseek" ? "DeepSeek" : "OpenAI"} dashboard
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-key" className="text-sm">Save API key locally</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Store encrypted on your device only</p>
                  </div>
                  <Switch 
                    id="save-key" 
                    checked={saveKey}
                    onCheckedChange={setSaveKey}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t px-6 py-4">
                <Button 
                  className="w-full"
                  onClick={saveSettings}
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="help" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CircleHelp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Help & Documentation
                </CardTitle>
                <CardDescription>
                  Learn how to use Alef Solver effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Getting Started</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Choose your preferred AI model in the Settings tab</li>
                    <li>Enter your API key for the selected model</li>
                    <li>Navigate to the Solver tab</li>
                    <li>Type your question in the text area</li>
                    <li>Click "Get Answer" or press Ctrl+Enter to see results</li>
                    <li>Review your answer and use the copy button if needed</li>
                  </ol>
                </div>
                
                <Alert variant="default" className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1">
                    <CircleHelp className="w-4 h-4" /> Important Note
                  </h3>
                  <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    You must provide a valid API key for your selected model in the Settings tab before using the solver.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Interface Features</h3>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Drag the application by clicking and holding the title bar</li>
                    <li>Minimize the application by clicking the minimize button</li>
                    <li>Recent questions are saved for quick access</li>
                    <li>Dark mode automatically follows your system preferences</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">API Key Information</h3>
                  <p>For API keys and documentation, visit:</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <a 
                      href="https://deepseek.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white dark:bg-gray-800 border rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">DeepSeek AI</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">deepseek.ai</div>
                      </div>
                    </a>
                    <a 
                      href="https://openai.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-white dark:bg-gray-800 border rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors"
                    >
                      <div className="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-md">
                        <Bot className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">OpenAI</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">openai.com</div>
                      </div>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default App;