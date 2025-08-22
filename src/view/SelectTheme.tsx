import { CheckCircle } from 'lucide-react';
import { DarkTheme, LightTheme } from './Themes';
import type { SelectThemeProps } from '../types';

export default function SelectTheme({
  selectedTheme,
  setSelectedTheme,
}: SelectThemeProps) {
  const handleCardClick = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const themeCards = [
    {
      id: 1,
      themeName: 'Dark Theme',
      theme: <DarkTheme selectedTheme={selectedTheme} themeName='Dark Theme' />,
    },
    {
      id: 2,
      themeName: 'Light Theme',
      theme: (
        <LightTheme selectedTheme={selectedTheme} themeName='Light Theme' />
      ),
    },
  ];

  return (
    <div>
      <h2 className='text-lg md:text-xl font-bold text-gray-900'>
        Choose Your Theme
      </h2>
      <p className='text-sm md:text-base text-gray-500 font-medium mt-1'>
        Pick a theme to style your page and give it a personal touch
      </p>

      <div className='grid grid-cols-2 gap-4 md:gap-6 mt-4'>
        {themeCards.map((card) => (
          <div key={card.id} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm md:text-base font-medium'>
                {card.themeName}
              </span>
              <CheckCircle
                className={`h-5 w-5 ${
                  selectedTheme === card.themeName
                    ? 'text-blue-600'
                    : 'text-gray-300'
                }`}
              />
            </div>

            <div
              onClick={() => handleCardClick(card.themeName)}
              className={`rounded-2xl border-2 transition-all cursor-pointer ${
                selectedTheme === card.themeName
                  ? 'border-blue-600 p-1'
                  : 'border-transparent'
              } hover:border-blue-600 hover:p-1`}
            >
              {card.theme}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
