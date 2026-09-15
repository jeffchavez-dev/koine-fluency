import { useState } from 'react'

export default function Sidebar({ sheets, onSelectSheet, onChangeView, currentView, progress, selectedFlashcardSheets, onToggleFlashcardSheet }) {
  const [isOpen, setIsOpen] = useState(true)

  const categories = {
    interrogatives: 'Question Words & Comm.',
    communication: 'Communication',
    'daily-life': 'Daily Life',
    grammar: 'Grammar',
    drilling: 'Drilling'
  }

  const groupedSheets = sheets.reduce((acc, sheet) => {
    const cat = sheet.category || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(sheet)
    return acc
  }, {})

  // Filter sheets that have content for flashcard practice (exclude drilling methodology sheets)
  const practiceSheets = sheets.filter(s => {
    // Skip drilling/methodology sheets
    if (s.category === 'drilling') return false
    // Include sheets with vocabulary content
    if (s.sections) return s.sections.some(sec => sec.terms && sec.terms.length > 0)
    return s.terms && s.terms.length > 0
  })

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 z-50 bg-yellow-600 text-white p-2 rounded transition-all ${
          isOpen ? 'right-4 left-auto' : 'left-4'
        }`}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative w-64 h-full bg-slate-800 border-r border-slate-700 flex flex-col transition-transform z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
      {/* Header */}
      <div className="p-2 border-b border-slate-700">
        <h1 className="greek-title text-lg mb-0">Ἡ Φωνή</h1>
        <p className="text-xs text-slate-500">Fluency</p>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 border-b border-slate-700">
        {[
          { id: 'browser', label: 'Browse Sheets', icon: '📖' },
          { id: 'flashcards', label: 'Flashcards', icon: '🗂️' },
          { id: 'exercises', label: 'Drills', icon: '⚡' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full text-left px-3 py-1 text-sm rounded transition ${
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

      {/* Sheets List - Context Aware */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentView === 'flashcards' ? (
          <>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Lessons:
              </h3>
              <div className="space-y-1">
                {practiceSheets.map(sheet => (
                  <label
                    key={sheet.id}
                    className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-700 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFlashcardSheets.has(sheet.id)}
                      onChange={() => onToggleFlashcardSheet(sheet.id)}
                      className="mt-0.5 w-4 h-4 rounded accent-yellow-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-300 font-medium truncate greek-text leading-tight">
                        {sheet.greek_title}
                      </div>
                      <div className="text-xs text-slate-500 leading-tight">
                        {sheet.sections ? sheet.sections.reduce((sum, sec) => sum + sec.terms.length, 0) : sheet.terms?.length || 0} terms
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
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
                      <div className="text-xs text-slate-200 font-medium truncate greek-text">
                        {sheet.greek_title}
                      </div>
                      {progress[sheet.id]?.studied && (
                        <span className="text-yellow-500 text-xs">✓ Studied</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        Ἀρχὴ τοῦ εὐαγγελίου
      </div>
      </aside>
    </>
  )
}
