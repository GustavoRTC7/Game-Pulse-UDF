import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Settings, Volume2, Globe, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState({
    volume: 80,
    musicVolume: 70,
    effectsVolume: 90,
    language: i18n.language || 'en-US'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleVolumeChange = (type: string, value: number) => {
    setSettings(prev => ({ ...prev, [type]: value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSettings(prev => ({ ...prev, language: newLanguage }));
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    alert(t('settings.save') + ' - Success!');
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Settings size={24} className="text-purple-400 mr-2" />
          {t('settings.title')}
        </h1>
        <p className="text-gray-400">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Globe size={20} className="mr-2" />
              {t('settings.language.title')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <select
                value={settings.language}
                onChange={handleLanguageChange}
                className="w-full bg-gray-800 text-gray-100 rounded-lg border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="en-US">{t('settings.language.options.en')}</option>
                <option value="pt-BR">{t('settings.language.options.pt')}</option>
              </select>
              <p className="text-sm text-gray-400">{t('settings.language.subtitle')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Volume2 size={20} className="mr-2" />
              {t('settings.sound.title')}
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('settings.sound.masterVolume')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => handleVolumeChange('volume', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {settings.volume}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('settings.sound.musicVolume')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => handleVolumeChange('musicVolume', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {settings.musicVolume}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('settings.sound.effectsVolume')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.effectsVolume}
                  onChange={(e) => handleVolumeChange('effectsVolume', Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {settings.effectsVolume}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="flex items-center">
          <Save size={16} className="mr-2" />
          {t('settings.save')}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;