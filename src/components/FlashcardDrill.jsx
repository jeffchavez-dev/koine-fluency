import { useState, useMemo } from 'react'

export default function FlashcardDrill({ sheets, onMarkStudied, selectedSheetIds: propSelectedSheetIds, onToggleLessonSelection: propOnToggleLessonSelection, onNotSureAdded }) {
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
  const [roundNumber, setRoundNumber] = useState(1)
  const [reviewMode, setReviewMode] = useState('smart') // 'smart', 'weak', 'fresh', 'mixed'
  const [roundStats, setRoundStats] = useState({ correct: 0, total: 0 })

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

  // Get review history from localStorage
  const getReviewHistory = () => {
    const saved = localStorage.getItem('koine-reviewHistory') || '{}'
    return JSON.parse(saved)
  }

  // Save review history
  const saveReviewHistory = (history) => {
    localStorage.setItem('koine-reviewHistory', JSON.stringify(history))
  }

  // Weight cards for spaced repetition
  const weightCardsByReviewMode = (cards, mode) => {
    const history = getReviewHistory()

    if (mode === 'weak') {
      // Only cards marked "not sure"
      return cards.filter(c => {
        const key = `${c.sheetId}-${c.greek}`
        return history[key]?.notSureCount > 0
      })
    }

    if (mode === 'fresh') {
      // Only unreviewed cards
      return cards.filter(c => {
        const key = `${c.sheetId}-${c.greek}`
        return !history[key] || history[key].reviewCount === 0
      })
    }

    if (mode === 'mixed') {
      // Random mix of all cards
      const shuffled = [...cards]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // 'smart' mode: 70% weak cards + 30% new cards
    const weak = cards.filter(c => {
      const key = `${c.sheetId}-${c.greek}`
      return history[key]?.notSureCount > 0
    })
    const fresh = cards.filter(c => {
      const key = `${c.sheetId}-${c.greek}`
      return !history[key] || history[key].reviewCount === 0
    })

    const weakRatio = Math.ceil(10 * 0.7)
    const freshRatio = 10 - weakRatio

    const selected = weak.slice(0, weakRatio).concat(fresh.slice(0, freshRatio))
    return selected
  }

  const filtered = useMemo(() => {
    if (selectedSheetIds.size === 0) return []

    // Special case: μανθανειν learning deck (magic ID: -1)
    if (selectedSheetIds.has(-1)) {
      const notSureTerms = JSON.parse(localStorage.getItem('koine-notSure') || '[]')
      return notSureTerms.map(term => ({
        ...term,
        sheetId: term.sheetId,
        sheetTitle: term.sheetTitle,
        greek: term.greek,
        english: term.english,
        examples: term.examples || [],
        category: 'learning'
      }))
    }

    const cards = flashcards.filter(c => selectedSheetIds.has(c.sheetId))

    // Apply spaced repetition weighting
    const weighted = weightCardsByReviewMode(cards, reviewMode)

    // Limit to 10 cards per round, shuffle if not already sorted by review mode
    const rounded = weighted.slice(0, 10)
    if (reviewMode === 'smart' || reviewMode === 'mixed') {
      // Shuffle for variety
      for (let i = rounded.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rounded[i], rounded[j]] = [rounded[j], rounded[i]]
      }
    }
    return rounded
  }, [flashcards, selectedSheetIds, reviewMode])

  const currentCard = filtered[currentIndex]
  const practiceSheets = sheets.filter(s => {
    if (s.sections) return s.sections.some(sec => sec.terms && sec.terms.length > 0)
    return s.terms && s.terms.length > 0
  })

  const handleCorrect = () => {
    setStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }))
    setRoundStats(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }))

    // Update review history
    if (currentCard) {
      const history = getReviewHistory()
      const key = `${currentCard.sheetId}-${currentCard.greek}`
      history[key] = {
        reviewCount: (history[key]?.reviewCount || 0) + 1,
        notSureCount: history[key]?.notSureCount || 0,
        lastReviewDate: new Date().toISOString()
      }
      saveReviewHistory(history)
    }

    nextCard()
  }

  const handleIncorrect = () => {
    setStats(s => ({ ...s, total: s.total + 1 }))
    setRoundStats(s => ({ ...s, total: s.total + 1 }))

    // Track this term as "not sure" for μανθανειν learning deck
    if (currentCard) {
      const saved = JSON.parse(localStorage.getItem('koine-notSure') || '[]')
      const termKey = `${currentCard.sheetId}-${currentCard.greek}`
      if (!saved.find(t => t.key === termKey)) {
        saved.push({
          key: termKey,
          sheetId: currentCard.sheetId,
          sheetTitle: currentCard.sheetTitle,
          greek: currentCard.greek,
          english: currentCard.english,
          examples: currentCard.examples
        })
        localStorage.setItem('koine-notSure', JSON.stringify(saved))
        onNotSureAdded?.()
      }

      // Update review history
      const history = getReviewHistory()
      const key = `${currentCard.sheetId}-${currentCard.greek}`
      history[key] = {
        reviewCount: (history[key]?.reviewCount || 0) + 1,
        notSureCount: (history[key]?.notSureCount || 0) + 1,
        lastReviewDate: new Date().toISOString()
      }
      saveReviewHistory(history)
    }
    nextCard()
  }

  const nextCard = () => {
    setCurrentIndex(currentIndex + 1)
    setIsFlipped(false)
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  // Check if current round is completed (10 cards or fewer)
  const isRoundCompleted = filtered.length > 0 && currentIndex >= filtered.length

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
        ) : isRoundCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center max-w-md space-y-6">
              <div>
                <div className="text-5xl mb-2">✓</div>
                <h2 className="text-2xl font-bold text-yellow-400">Round {roundNumber} Complete!</h2>
              </div>

              <div className="space-y-3 text-slate-300 bg-slate-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Cards</p>
                    <p className="text-2xl font-bold text-yellow-400">{roundStats.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Mastered</p>
                    <p className="text-2xl font-bold text-green-400">{roundStats.correct}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-600">
                  {roundNumber === 1 && "💡 Spacing effect: review these cards tomorrow for 2x retention"}
                  {roundNumber === 2 && "🧠 You're building long-term memory—great work!"}
                  {roundNumber >= 3 && "⚠️ Consider ending here—diminishing returns after 3 rounds"}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setIsFlipped(false)
                    setRoundStats({ correct: 0, total: 0 })
                    setRoundNumber(roundNumber + 1)
                    setReviewMode('smart')
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  📚 Continue Smart Review
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setIsFlipped(false)
                    setRoundStats({ correct: 0, total: 0 })
                    setRoundNumber(roundNumber + 1)
                    setReviewMode('weak')
                  }}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  💪 Focus on Weak Words
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setIsFlipped(false)
                    setRoundStats({ correct: 0, total: 0 })
                    setRoundNumber(roundNumber + 1)
                    setReviewMode('fresh')
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  ✨ Fresh Cards
                </button>
                <button
                  onClick={() => {
                    setCurrentIndex(0)
                    setIsFlipped(false)
                    setRoundStats({ correct: 0, total: 0 })
                    setRoundNumber(roundNumber + 1)
                    setReviewMode('mixed')
                  }}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  🔄 Mixed Review
                </button>
              </div>

              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setIsFlipped(false)
                  setStats({ correct: 0, total: 0 })
                  setRoundStats({ correct: 0, total: 0 })
                  setRoundNumber(1)
                  setReviewMode('smart')
                }}
                className="text-sm text-slate-400 hover:text-slate-300 transition"
              >
                End Session
              </button>
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
              {currentIndex > 0 && (
                <button
                  onClick={prevCard}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-sm"
                >
                  ⊲ Back
                </button>
              )}
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
            <div className="mt-4 text-center text-slate-400 text-xs md:text-sm space-y-1">
              <div>Card {currentIndex + 1} of {filtered.length}</div>
              <div className="text-xs text-slate-500">Round {roundNumber}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
