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
          {/* Pedagogical Introduction */}
          {sheet.pedagogical_note && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border-l-4 border-green-600">
              <p className="text-slate-300 italic text-sm">{sheet.pedagogical_note}</p>
            </div>
          )}

          {/* Parse Instruction */}
          {sheet.parse_instruction && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border-l-4 border-blue-600">
              <div className="text-xs text-blue-400 uppercase font-semibold mb-2">How to Practice</div>
              <p className="text-slate-300 text-sm">{sheet.parse_instruction}</p>
            </div>
          )}

          {/* Parsing Order (Fixed Formula) */}
          {(sheet.parsing_order || sheet.parsing_order_verb) && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border-l-4 border-purple-600">
              <div className="text-xs text-purple-400 uppercase font-semibold mb-3">The Order to Say It</div>
              {sheet.parsing_order && (
                <p className="text-slate-300 text-sm mb-2">{sheet.parsing_order}</p>
              )}
              {sheet.parsing_order_verb && (
                <div className="space-y-2">
                  <div className="text-slate-300 text-sm">
                    <span className="font-semibold">Verb:</span> {sheet.parsing_order_verb}
                  </div>
                  <div className="text-slate-300 text-sm">
                    <span className="font-semibold">Noun:</span> {sheet.parsing_order_noun}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Parsing Examples (for Sheet 19) */}
          {sheet.parsing_examples && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6 border-l-4 border-yellow-600">
              <div className="text-xs text-yellow-400 uppercase font-semibold mb-4">Parsing Examples</div>
              <div className="space-y-4">
                {sheet.parsing_examples.map((example, idx) => (
                  <div key={idx} className="bg-slate-900 rounded p-3">
                    <div className="greek-text text-yellow-300 font-semibold mb-2">{example.greek}</div>
                    <div className="greek-text text-slate-300 text-sm mb-2">{example.answer}</div>
                    <div className="text-slate-400 italic text-sm">{example.english}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms List - Handle both flat terms and sections */}
          {sheet.sections ? (
            <div className="space-y-6">
              {sheet.sections.map((section, sIdx) => (
                <div key={sIdx}>
                  <h3 className="text-sm font-semibold text-yellow-400 mb-3 uppercase tracking-wide">{section.title}</h3>
                  <div className="space-y-3">
                    {section.terms.map((term, tIdx) => (
                      <div key={tIdx} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
                        <div className="greek-text text-yellow-400 text-xl font-semibold mb-2">
                          {term.greek}
                        </div>
                        <div className="text-slate-200 mb-4">{term.english}</div>

                        {term.narrative && (
                          <div className="bg-slate-900 rounded p-3 mb-4 border-l-4 border-yellow-600">
                            <div className="text-xs text-yellow-600 uppercase font-semibold mb-2">First-person narrative</div>
                            <div className="greek-text text-yellow-200 text-sm mb-2 italic">{term.narrative}</div>
                            <div className="text-slate-400 text-sm">{term.narrative_english}</div>
                          </div>
                        )}

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
                </div>
              ))}
            </div>
          ) : sheet.terms ? (
            <div className="space-y-3">
              {sheet.terms.map((term, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
                  <div className="greek-text text-yellow-400 text-xl font-semibold mb-2">
                    {term.greek}
                  </div>
                  <div className="text-slate-200 mb-4">{term.english}</div>

                  {term.narrative && (
                    <div className="bg-slate-900 rounded p-3 mb-4 border-l-4 border-yellow-600">
                      <div className="text-xs text-yellow-600 uppercase font-semibold mb-2">First-person narrative</div>
                      <div className="greek-text text-yellow-200 text-sm mb-2 italic">{term.narrative}</div>
                      <div className="text-slate-400 text-sm">{term.narrative_english}</div>
                    </div>
                  )}

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
          ) : null}

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
