import { useState, useEffect } from 'react'
import SheetBrowser from './components/SheetBrowser'
import FlashcardDrill from './components/FlashcardDrill'
import Sidebar from './components/Sidebar'
import sheetsData from './data/sheets.json'
import './App.css'

export default function App() {
  const [currentView, setCurrentView] = useState('browser')
  const [selectedSheetId, setSelectedSheetId] = useState(2)
  const [selectedFlashcardSheets, setSelectedFlashcardSheets] = useState(new Set())
  const [progress, setProgress] = useState({})

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('koine-progress')
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('koine-progress', JSON.stringify(progress))
  }, [progress])

  const markSheetStudied = (sheetId) => {
    setProgress(p => ({
      ...p,
      [sheetId]: { ...p[sheetId], studied: true, lastStudied: new Date().toISOString() }
    }))
  }

  const toggleFlashcardSheet = (sheetId) => {
    const newSelected = new Set(selectedFlashcardSheets)
    if (newSelected.has(sheetId)) {
      newSelected.delete(sheetId)
    } else {
      newSelected.add(sheetId)
    }
    setSelectedFlashcardSheets(newSelected)
  }

  return (
    <div className="flex h-screen bg-slate-900 w-full overflow-hidden">
      <Sidebar
        sheets={sheetsData.sheets}
        onSelectSheet={setSelectedSheetId}
        onChangeView={setCurrentView}
        currentView={currentView}
        progress={progress}
        selectedFlashcardSheets={selectedFlashcardSheets}
        onToggleFlashcardSheet={toggleFlashcardSheet}
      />

      <main className="flex-1 overflow-hidden flex flex-col w-full">
        {currentView === 'browser' && (
          <SheetBrowser
            sheets={sheetsData.sheets}
            selectedSheetId={selectedSheetId}
            onMarkStudied={markSheetStudied}
          />
        )}
        {currentView === 'flashcards' && (
          <FlashcardDrill
            sheets={sheetsData.sheets}
            onMarkStudied={markSheetStudied}
            selectedSheetIds={selectedFlashcardSheets}
            onToggleLessonSelection={toggleFlashcardSheet}
          />
        )}
      </main>
    </div>
  )
}
