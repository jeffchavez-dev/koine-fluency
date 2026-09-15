import { useState, useMemo } from 'react'

export default function FlashcardDrill({ sheets, onMarkStudied, selectedSheetIds: propSelectedSheetIds, onToggleLessonSelection: propOnToggleLessonSelection }) {
  // Use props if provided (from App), otherwise manage local state
  const [localSelectedSheetIds, setLocalSelectedSheetIds] = useState(new Set())
  const selectedSheetIds = propSelectedSheetIds !== undefined ? propSelectedSheetIds : localSelectedSheetIds
  const onToggleLessonSelection = propOnToggleLessonSelection || ((sheetId) => {
    const newSelected = new Set(localSelectedSheetIds)
    if (newSelected.has(sheetId)) {
      newSelected.delete(sheetId)
    } else {
      newSelected.add(sheetId)
    }
    setLocalSelectedSheetIds(newSelected)
    setCurrentIndex(0)
    setIsFlipped(false)
    setStats({ correct: 0, total: 0 })
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })

  // Build flashcard deck from all terms (handles both flat terms and sections)
  const flashcards = useMemo(() => {
    const cards = []
    sheets.forEach(sheet => {
      // Handle sections structure (new format)
      if (sheet.sections) {
        sheet.sections.forEach(section => {
          section.terms.forEach(term => {
            cards.push({
              sheetId: sheet.id,
              sheetTitle: sheet.english_title,
              greek: term.greek,
              english: term.english,
              examples: term.examples || [],
              category: sheet.category
            })
          })
        })
      }
      // Handle flat terms structure (old format)
      else if (sheet.terms) {
        sheet.terms.forEach(term => {
          cards.push({
            sheetId: sheet.id,
            sheetTitle: sheet.english_title,
            greek: term.greek,
            english: term.english,
            examples: term.examples || [],
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
  const practiceSheets = sheets.filter(s => {
    if (s.sections) return s.sections.some(sec => sec.terms && sec.terms.length > 0)
    return s.terms && s.terms.length > 0
  })

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
          {stats.total > 0 && (
            <div className="text-xs text-slate-400 ml-auto">
              {stats.correct}/{stats.total}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-3 overflow-hidden p-3">
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
                    <div className="text-center max-h-64 overflow-y-auto">
                      <p className="text-slate-400 text-xs md:text-sm mb-3">English</p>
                      <p className="text-base md:text-xl text-slate-100 font-semibold break-words mb-4">
                        {currentCard?.english}
                      </p>
                      {currentCard?.examples && currentCard.examples.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-600 text-left space-y-3">
                          <p className="text-xs text-slate-400 uppercase">Examples:</p>
                          {currentCard.examples.map((ex, idx) => (
                            <div key={idx} className="text-sm bg-slate-700 rounded p-3">
                              <div className="greek-text text-yellow-300 text-sm mb-1">{ex.greek}</div>
                              <div className="text-slate-300 italic text-xs">{ex.english}</div>
                              <div className="text-slate-500 text-xs mt-1">{ex.reference}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              {!isFlipped && (
                <button
                  onClick={nextCard}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-sm"
                >
                  ⊳ Skip
                </button>
              )}
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
