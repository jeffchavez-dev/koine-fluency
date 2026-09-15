import { useState, useMemo } from 'react'

export default function FlashcardDrill({ sheets, onMarkStudied }) {
  const [selectedSheetIds, setSelectedSheetIds] = useState(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [showLessonPanel, setShowLessonPanel] = useState(true)

  // Build flashcard deck from all terms
  const flashcards = useMemo(() => {
    const cards = []
    sheets.forEach(sheet => {
      if (sheet.terms) {
        sheet.terms.forEach(term => {
          cards.push({
            sheetId: sheet.id,
            sheetTitle: sheet.english_title,
            greek: term.greek,
            english: term.english,
            category: sheet.category
          })
        })
      }
    })
    return cards
  }, [sheets])

  const filtered = useMemo(() => {
    if (selectedSheetIds.size === 0) return []
    const cards = flashcards.filter(c => selectedSheetIds.has(c.sheetId))
    // Shuffle cards (Fisher-Yates)
    const shuffled = [...cards]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [flashcards, selectedSheetIds])

  const currentCard = filtered[currentIndex]
  const practiceSheets = sheets.filter(s => s.terms && s.terms.length > 0)

  const toggleLessonSelection = (sheetId) => {
    const newSelected = new Set(selectedSheetIds)
    if (newSelected.has(sheetId)) {
      newSelected.delete(sheetId)
    } else {
      newSelected.add(sheetId)
    }
    setSelectedSheetIds(newSelected)
    setCurrentIndex(0)
    setIsFlipped(false)
    setStats({ correct: 0, total: 0 })
  }

  const handleCorrect = () => {
    setStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }))
    nextCard()
  }

  const handleIncorrect = () => {
    setStats(s => ({ ...s, total: s.total + 1 }))
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      // Restart
      setCurrentIndex(0)
      setIsFlipped(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-auto">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-3 py-2 sticky top-0 z-10 mt-12 md:mt-0">
        <div className="flex justify-between items-center gap-2">
          <h2 className="text-sm md:text-base font-bold text-slate-100">Flashcard</h2>
          <div className="flex items-center gap-2">
            {stats.total > 0 && (
              <div className="text-xs text-slate-400 hidden md:block">
                {stats.correct}/{stats.total}
              </div>
            )}
            <button
              onClick={() => setShowLessonPanel(!showLessonPanel)}
              className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition whitespace-nowrap"
              title={showLessonPanel ? "Hide lessons" : "Show lessons"}
            >
              {showLessonPanel ? '✕' : '◄'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-3 overflow-hidden p-3">
        {/* Lesson Selection Panel */}
        {showLessonPanel && (
          <div className="w-64 bg-slate-800 rounded-lg p-3 overflow-y-auto border border-slate-700">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Lessons:</h3>
            <div className="space-y-1">
              {practiceSheets.map(sheet => (
                <label
                  key={sheet.id}
                  className="flex items-start gap-2 p-1.5 rounded hover:bg-slate-700 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedSheetIds.has(sheet.id)}
                    onChange={() => toggleLessonSelection(sheet.id)}
                    className="mt-0.5 w-4 h-4 rounded accent-yellow-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 font-medium truncate greek-text leading-tight">
                      {sheet.greek_title}
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">
                      {sheet.terms?.length || 0}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Flashcard Area */}
        {selectedSheetIds.size === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-400 mb-2">Select lessons to begin</p>
              <p className="text-xs text-slate-500">Choose one or more lessons on the left</p>
            </div>
          </div>
        ) : (

          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-2xl cursor-pointer h-72 md:h-96"
            >
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 md:p-12 shadow-2xl border border-slate-600 h-full flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-yellow-500/20"
              >
                <div className="text-center">
                  {!isFlipped ? (
                    <div>
                      <p className="text-slate-400 text-xs md:text-sm mb-3">Greek</p>
                      <p className="greek-text text-2xl md:text-4xl text-yellow-400 font-bold break-words">
                        {currentCard?.greek}
                      </p>
                      <p className="text-slate-500 text-xs md:text-sm mt-6">Click to reveal</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-400 text-xs md:text-sm mb-3">English</p>
                      <p className="text-base md:text-xl text-slate-100 font-semibold break-words">
                        {currentCard?.english}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-3 justify-center">
              {isFlipped && (
                <>
                  <button
                    onClick={handleIncorrect}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                  >
                    ✗ Not sure
                  </button>
                  <button
                    onClick={handleCorrect}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                  >
                    ✓ Got it!
                  </button>
                </>
              )}
            </div>

            {/* Progress */}
            <div className="mt-4 text-center text-slate-400 text-xs md:text-sm">
              Card {currentIndex + 1} of {filtered.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
