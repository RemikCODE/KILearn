const slogans = [
  'Angażuj pamięć motoryczną i zwiększ skuteczność nauki',
  'Ucz się szybciej żmudnych pojęć — do szkoły i nie tylko',
  'Mniej zakuwania, więcej zrozumienia',
  'Klikaj, przesuwaj, powtarzaj — tak zapada wiedza',
  'KILearn zamienia trudne tematy w krótkie kroki',
]

export function SloganTicker() {
  const items = [...slogans, ...slogans]

  return (
    <div className="slogan-ticker" aria-label="Slogany KILearn">
      <div className="ticker-track">
        {items.map((slogan, index) => (
          <span className="ticker-item" key={`${slogan}-${index}`}>
            <span className="ticker-dot" />
            {slogan}
          </span>
        ))}
      </div>
    </div>
  )
}