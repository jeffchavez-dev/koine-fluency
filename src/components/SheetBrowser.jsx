import { useState } from 'react'

export default function SheetBrowser({ sheets, selectedSheetId, onMarkStudied }) {
  const sheet = sheets.find(s => s.id === selectedSheetId)
  const [showMarked, setShowMarked] = useState(false)

  if (!sheet) return <div className="p-8">No sheet selected</div>

  return (
    <div className="flex-1 overflow-auto flex flex-col bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 sticky top-0 z-10">
        <div className="flex justify-between items-center gap-2">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 mb-0">Sheet {sheet.number}</p>
            <h1 className="greek-title text-sm md:text-base mb-0">{sheet.greek_title}</h1>
          </div>
          <button
            onClick={() => {
              onMarkStudied(sheet.id)
              setShowMarked(true)
              setTimeout(() => setShowMarked(false), 2000)
            }}
            className={`px-2 py-1 text-xs rounded transition whitespace-nowrap ${
              showMarked
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {showMarked ? '✓' : 'Mark'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="max-w-4xl">
          {/* Terms List */}
          {sheet.terms && (
            <div className="space-y-3">
              {sheet.terms.map((term, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
                  <div className="greek-text text-yellow-400 text-xl font-semibold mb-2">
                    {term.greek}
                  </div>
                  <div className="text-slate-200 mb-4">{term.english}</div>

                  {term.examples && term.examples.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-slate-600">
                      {term.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="text-sm">
                          <div className="greek-text text-slate-100 mb-1">{ex.greek}</div>
                          <div className="text-slate-400 italic">{ex.english}</div>
                          <div className="text-xs text-slate-500 mt-1">{ex.reference}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drills (for drilling sheet) */}
          {sheet.drills && (
            <div className="space-y-8">
              {sheet.drills.map((drill, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="greek-text text-yellow-400 text-lg font-semibold mb-2">
                    {drill.greek}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{drill.name}</h3>
                  <p className="text-slate-300 mb-4">{drill.description}</p>

                  {drill.example && (
                    <div className="bg-slate-900 rounded p-4 mb-4">
                      <p className="text-xs text-slate-400 mb-2">Example:</p>
                      <div className="greek-text text-slate-100">{drill.example}</div>
                    </div>
                  )}

                  {drill.prompts && (
                    <div className="space-y-2">
                      {drill.prompts.map((prompt, pIdx) => (
                        <div key={pIdx} className="text-sm">
                          <span className="text-yellow-400">{prompt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {drill.examples && (
                    <div className="space-y-2 mt-4">
                      {drill.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="greek-text text-slate-300 text-sm bg-slate-900 rounded p-2">
                          {ex}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
