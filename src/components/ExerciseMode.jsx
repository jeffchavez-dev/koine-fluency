import { useState } from 'react'

export default function ExerciseMode({ sheets }) {
  const [selectedDrill, setSelectedDrill] = useState(null)
  const [selectedSheet, setSelectedSheet] = useState(null)

  const drillingSheet = sheets.find(s => s.id === 20)

  return (
    <div className="flex-1 overflow-auto bg-slate-900 p-8">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Drilling Techniques</h2>
        <p className="text-slate-400 mb-8">Practice active fluency with these five time-tested drilling methods</p>

        {/* Drills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {drillingSheet?.drills?.map((drill, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDrill(idx)}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500 transition text-left"
            >
              <p className="greek-text text-yellow-400 text-sm font-semibold mb-2">
                {drill.greek}
              </p>
              <h3 className="text-xl font-bold text-slate-100 mb-2">{drill.name}</h3>
              <p className="text-slate-400 text-sm">{drill.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Drill Details */}
        {selectedDrill !== null && drillingSheet?.drills[selectedDrill] && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="greek-text text-yellow-400 text-sm font-semibold mb-2">
                  {drillingSheet.drills[selectedDrill].greek}
                </p>
                <h3 className="text-2xl font-bold text-slate-100">
                  {drillingSheet.drills[selectedDrill].name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDrill(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-900 rounded border border-slate-700">
              <p className="text-slate-100 mb-4">{drillingSheet.drills[selectedDrill].description}</p>
            </div>

            {/* Drill Instructions */}
            {drillingSheet.drills[selectedDrill].example && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-100 mb-3">Example:</h4>
                <div className="bg-slate-900 rounded p-4 greek-text text-slate-200">
                  {drillingSheet.drills[selectedDrill].example}
                </div>
              </div>
            )}

            {drillingSheet.drills[selectedDrill].prompts && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-100 mb-3">Prompts:</h4>
                <ul className="space-y-2">
                  {drillingSheet.drills[selectedDrill].prompts.map((prompt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span className="text-slate-300">{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {drillingSheet.drills[selectedDrill].examples && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-100 mb-3">Formulas:</h4>
                <div className="space-y-3">
                  {drillingSheet.drills[selectedDrill].examples.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-slate-900 rounded p-4 greek-text text-slate-200">
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Tips */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-700/30 rounded-lg p-4 mt-6">
              <p className="text-yellow-200 text-sm">
                💡 <strong>Tip:</strong> Fluency comes from producing the language. Practice little and often—three minutes daily beats one long session.
              </p>
            </div>
          </div>
        )}

        {/* Sheets Selection for Practice */}
        {selectedDrill === null && (
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-4">Available Practice Sheets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sheets.filter(s => s.id !== 20).map(sheet => (
                <div
                  key={sheet.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
                >
                  <p className="text-xs text-slate-400 mb-1">Sheet {sheet.number}</p>
                  <h4 className="font-semibold text-slate-100 mb-2">{sheet.english_title}</h4>
                  <p className="text-sm text-slate-400 mb-3">{sheet.category}</p>
                  {sheet.terms && (
                    <p className="text-xs text-yellow-400">
                      {sheet.terms.length} terms available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
