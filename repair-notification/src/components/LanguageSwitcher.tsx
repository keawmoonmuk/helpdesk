
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  variant?: 'default' | 'sidebar';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-xs text-gray-500">{t('common.language')}:</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {language === 'th' ? t('language.thai') : t('language.english')}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white">
            <DropdownMenuItem 
              className={`${language === 'th' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setLanguage('th')}>
              {t('language.thai')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className={`${language === 'en' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setLanguage('en')}>
              {t('language.english')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {language === 'th' ? t('language.thai') : t('language.english')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem 
          className={`${language === 'th' ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={() => setLanguage('th')}>
          {t('language.thai')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`${language === 'en' ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={() => setLanguage('en')}>
          {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
