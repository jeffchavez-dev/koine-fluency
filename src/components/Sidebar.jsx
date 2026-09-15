export default function Sidebar({ sheets, onSelectSheet, onChangeView, currentView, progress }) {
  const categories = {
    interrogatives: 'Question Words & Comm.',
    communication: 'Communication',
    grammar: 'Grammar',
    drilling: 'Drilling'
  }

  const groupedSheets = sheets.reduce((acc, sheet) => {
    const cat = sheet.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(sheet)
    return acc
  }, {})

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="greek-title text-2xl mb-2">Ἡ Φωνή</h1>
        <p className="text-xs text-slate-400">Koine Fluency</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 border-b border-slate-700">
        {[
          { id: 'browser', label: 'Browse Sheets', icon: '📖' },
          { id: 'flashcards', label: 'Flashcards', icon: '🗂️' },
          { id: 'exercises', label: 'Drills', icon: '⚡' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full text-left px-4 py-2 rounded transition ${
              currentView === item.id
                ? 'bg-yellow-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sheets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedSheets).map(([category, sheetList]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {categories[category] || category}
            </h3>
            <div className="space-y-1">
              {sheetList.map(sheet => (
                <button
                  key={sheet.id}
                  onClick={() => onSelectSheet(sheet.id)}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-slate-700 transition text-slate-300"
                >
                  <span className="text-xs text-slate-500">{sheet.number}</span>
                  <div className="text-xs text-slate-200 font-medium truncate">
                    {sheet.english_title}
                  </div>
                  {progress[sheet.id]?.studied && (
                    <span className="text-yellow-500 text-xs">✓ Studied</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        Ἀρχὴ τοῦ εὐαγγελίου
      </div>
    </aside>
  )
}
