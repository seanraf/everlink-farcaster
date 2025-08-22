interface ThemeProps {
  selectedTheme: string;
  themeName: string;
}

export function DarkTheme({ selectedTheme, themeName }: ThemeProps) {
  const isSelected = selectedTheme === themeName;

  return (
    <div
      className={`rounded-2xl text-center pt-4 pb-2 px-2 md:p-6 bg-[#0f0f0f] border-2 border-[#252525]`}
    >
      <div className='text-white' style={{ lineHeight: '1.5' }}>
        <h2 className='text-[18px] md:text-[19.6px] font-semibold font-redacted'>
          Jakob
        </h2>
        <p className='select-theme-font-size font-redacted'>
          People who like new things
        </p>
      </div>

      <div className='flex flex-col mt-4 select-theme-button-gap'>
        {['Instagram', 'YouTube', 'TikTok'].map((label, i) => (
          <div
            key={i}
            className={`hoverable-button rounded-lg bg-white text-black font-medium transition-all font-redacted
            ${
              isSelected
                ? 'select-theme-button-padding'
                : 'non-select-theme-button-padding'
            }
            ${label === 'TikTok' ? 'tiktok-button-hidden' : ''}
            `}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LightTheme({ selectedTheme, themeName }: ThemeProps) {
  const isSelected = selectedTheme === themeName;
  return (
    <div
      className={`rounded-2xl text-center pt-4 pb-2 px-2 md:p-6 bg-[#FFFFFF] border-2 border-[#F3F4F9]`}
    >
      <div style={{ lineHeight: '1.5' }}>
        <h2 className='text-[18px] md:text-[19.6px] font-semibold font-redacted'>
          Jakob
        </h2>
        <p className='select-theme-font-size font-redacted'>
          People who like new things
        </p>
      </div>

      <div className='flex flex-col mt-4 select-theme-button-gap'>
        {['Instagram', 'YouTube', 'TikTok'].map((label, i) => (
          <div
            key={i}
            className={`hoverable-button rounded-lg bg-[#0f0f0f] text-white font-medium transition-all font-redacted
            ${
              isSelected
                ? 'select-theme-button-padding'
                : 'non-select-theme-button-padding'
            }
            ${label === 'TikTok' ? 'tiktok-button-hidden' : ''}
            `}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
