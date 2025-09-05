import React from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
]

export default function LanguageSwitcher({ selectedLanguage, onLanguageSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => onLanguageSelect(language.code)}
          className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
            selectedLanguage === language.code
              ? 'bg-accent/20 border-accent text-white'
              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
          }`}
        >
          <span className="text-2xl">{language.flag}</span>
          <span className="font-medium">{language.name}</span>
        </button>
      ))}
    </div>
  )
}