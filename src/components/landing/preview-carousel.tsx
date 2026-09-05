const previewItems = [
  {
    title: 'Dashboard',
    label: 'postęp nauki',
    accent: 'from-orange-500 to-amber-300',
    rows: ['w-3/4', 'w-1/2', 'w-2/3'],
  },
  {
    title: 'Fiszki',
    label: 'szybkie powtórki',
    accent: 'from-amber-400 to-orange-600',
    rows: ['w-2/3', 'w-4/5', 'w-1/2'],
  },
  {
    title: 'AI Tutor',
    label: 'trudne pojęcia krok po kroku',
    accent: 'from-orange-300 to-yellow-200',
    rows: ['w-4/5', 'w-1/3', 'w-3/5'],
  },
  {
    title: 'Powtórki',
    label: 'pamięć motoryczna w akcji',
    accent: 'from-orange-600 to-amber-400',
    rows: ['w-1/2', 'w-3/4', 'w-2/3'],
  },
]

export function PreviewCarousel() {
  const items = [...previewItems, ...previewItems]

  return (
    <div className="preview-marquee" aria-label="Przesuwane podglądy aplikacji KILearn">
      <div className="preview-track">
        {items.map((item, index) => (
          <article className="preview-card" key={`${item.title}-${index}`}>
            <div className="preview-card__topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-card__body">
              <div className={`preview-card__badge bg-gradient-to-r ${item.accent}`} />
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/60">{item.label}</p>
              </div>
              <div className="mt-4 space-y-2">
                {item.rows.map((row) => (
                  <span className={`block h-2 rounded-full bg-white/10 ${row}`} key={row} />
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <span className="h-14 rounded-2xl bg-white/10" />
                <span className="h-14 rounded-2xl bg-orange-400/25" />
                <span className="h-14 rounded-2xl bg-white/10" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}