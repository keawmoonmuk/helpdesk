
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t('index.title')}</h1>
          <p className="text-gray-600 mb-6">{t('index.subtitle')}</p>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">{t('index.login')}</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">{t('index.register')}</Link>
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            {t('index.troubleAccess')}{' '}
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              {t('index.resetPassword')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
