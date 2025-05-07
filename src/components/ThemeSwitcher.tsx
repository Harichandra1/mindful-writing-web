
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings } from "lucide-react";
import { Theme, getTheme, setTheme } from "@/utils/localStorage";

interface ThemeOption {
  name: string;
  value: Theme;
  icon: JSX.Element;
}

export default function ThemeSwitcher() {
  const [theme, setActiveTheme] = useState<Theme>(getTheme());
  
  const themeOptions: ThemeOption[] = [
    {
      name: "Light",
      value: "light",
      icon: <Sun size={16} />
    },
    {
      name: "Dark",
      value: "dark",
      icon: <Moon size={16} />
    },
    {
      name: "Solarized Light",
      value: "solarized-light",
      icon: <Sun size={16} className="text-[#b58900]" />
    },
    {
      name: "Solarized Dark",
      value: "solarized-dark",
      icon: <Moon size={16} className="text-[#b58900]" />
    }
  ];
  
  const handleThemeChange = (newTheme: Theme) => {
    setActiveTheme(newTheme);
    setTheme(newTheme);
    
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'solarized-light', 'solarized-dark');
    // Add the selected theme class
    document.documentElement.classList.add(newTheme);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 h-auto">
          <Settings size={18} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        <div className="space-y-1">
          <p className="text-sm font-medium px-2 py-1">Theme</p>
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              variant={theme === option.value ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start font-normal"
              onClick={() => handleThemeChange(option.value)}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
