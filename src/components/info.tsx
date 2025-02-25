import { Bot, CircleHelp } from "lucide-react";
import { Alert, AlertTitle } from '@/components/ui/alert';

export function Info(){
    return (
        <div>
            <div>
                <h3 className="font-medium mb-1.5">Quick Start</h3>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Set your API key in the Settings tab</li>
                  <li>Go to the Solver tab and verify or edit the question</li>
                  <li>Click "Get Answer" to process your question</li>
                  <li>Drag the header to move the extension around</li>
                </ol>
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2">
                <AlertTitle className="text-blue-800 dark:text-blue-300 flex items-center gap-1 font-medium text-xs">
                  <CircleHelp className="w-3 h-3" /> Keyboard Shortcuts
                </AlertTitle>
                <div className="text-blue-700 dark:text-blue-300 mt-1 space-y-1 text-xs">
                  <div className="flex items-center">
                    <kbd className="px-1 py-0.5 text-xs font-mono bg-white dark:bg-gray-800 border rounded mr-2 min-w-8 text-center">Ctrl+Enter</kbd>
                    <span>Submit question</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1 py-0.5 text-xs font-mono bg-white dark:bg-gray-800 border rounded mr-2 min-w-8 text-center">Esc</kbd>
                    <span>Cancel editing</span>
                  </div>
                </div>
              </Alert>
              
              <div>
                <h3 className="font-medium mb-1.5">Features</h3>
                <ul className="space-y-1 pl-4 list-disc">
                  <li>Edit questions directly by clicking the edit icon</li>
                  <li>Drag the header to move the extension anywhere on screen</li>
                  <li>Minimize for a compact view that stays out of your way</li>
                  <li>Copy answers or questions with a single click</li>
                  <li>Switch between different AI models</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1.5">API Resources</h3>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <a 
                    href="https://deepseek.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-1.5 border rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <div className="mr-1.5 p-1 bg-blue-100 dark:bg-blue-900 rounded">
                      <Bot className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs">DeepSeek AI</div>
                  </a>
                  <a 
                    href="https://openai.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-1.5 border rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <div className="mr-1.5 p-1 bg-green-100 dark:bg-green-900 rounded">
                      <Bot className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-xs">OpenAI</div>
                  </a>
                </div>
              </div>
        </div>
    )
}