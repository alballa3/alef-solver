import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { AlertTriangle, Key } from "lucide-react";
import { Button } from "../ui/button";
type ApiType = "deepseek" | "chatgpt";

export function Settings() {
  const getBrandName = () => (apiChoice === "deepseek" ? "DeepSeek" : "OpenAI");

  // Save settings to local storage
  const [apiChoice, setApiChoice] = useState<ApiType>("deepseek");
  const [saveKey, setSaveKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const saveSettings = () => {
    if (saveKey && apiKey) {
      localStorage.setItem(`${apiChoice}_api_key`, apiKey);
      //   showNotification("Settings saved");
    } else if (!saveKey) {
      localStorage.removeItem(`${apiChoice}_api_key`);
      //   showNotification("API key won't be saved");
      //   setActiveTab("solver");
    } else {
      //   showNotification("Please enter a valid API key", "error");
    }
  };

  // Handle API model change
  const handleApiChange = (value: string) => {
    setApiChoice(value as ApiType);
    const savedKey = localStorage.getItem(`${value}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
      setSaveKey(true);
    } else {
      setApiKey("");
    }
  };
  return (
    <div>
      <div className="space-y-2">
        <Label className="text-xs font-medium">Select AI Model</Label>
        <RadioGroup
          value={apiChoice}
          onValueChange={handleApiChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2 rounded border p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <RadioGroupItem value="deepseek" id="deepseek" />
            <Label
              htmlFor="deepseek"
              className="text-xs font-normal cursor-pointer"
            >
              DeepSeek AI
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded border p-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <RadioGroupItem value="chatgpt" id="chatgpt" />
            <Label
              htmlFor="chatgpt"
              className="text-xs font-normal cursor-pointer"
            >
              OpenAI / ChatGPT
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-1.5 pt-1">
        <Label
          htmlFor="api-key"
          className="text-xs font-medium flex items-center gap-1"
        >
          <Key className="w-3 h-3 text-gray-400" />
          {getBrandName()} API Key
        </Label>
        <Input
          id="api-key"
          type="password"
          placeholder="Enter API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="font-mono text-xs h-8"
        />
      </div>

      <div className="flex items-center justify-between pt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
        <Label htmlFor="save-key" className="text-xs">
          Save API key locally
        </Label>
        <Switch id="save-key" checked={saveKey} onCheckedChange={setSaveKey} />
      </div>

      <Alert className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2">
        <AlertTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-1 font-medium text-xs">
          <AlertTriangle className="w-3 h-3" /> Security Note
        </AlertTitle>
        <p className="text-amber-700 dark:text-amber-300 mt-0.5 text-xs">
          Your API key is stored in your browser's local storage. Only enable
          this on devices you trust.
        </p>
      </Alert>

      <Button className="w-full text-xs" onClick={saveSettings}>
        Save Settings
      </Button>
    </div>
  );
}
