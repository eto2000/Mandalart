import { useState, useEffect } from 'react'
import './App.css'
import MandalartGrid from './components/MandalartGrid'

const STORAGE_KEY = 'mandalart-history'

function App() {
  // Navigation stack: array of {nodeId, cells} objects
  const [history, setHistory] = useState(() => {
    // Load from localStorage on initial mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.length > 0 ? parsed : [{
          nodeId: 'root',
          cells: Array(9).fill('')
        }]
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
    // Default initial state
    return [{
      nodeId: 'root',
      cells: Array(9).fill('')
    }]
  })

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [history])

  const currentNode = history[history.length - 1]

  // Navigate to a child node (when clicking a non-center cell)
  const navigateToChild = (cellIndex) => {
    if (cellIndex === 4) return // Center cell doesn't navigate

    // Create new node with the clicked cell text as center
    const newNode = {
      nodeId: `${currentNode.nodeId}-${cellIndex}`,
      cells: Array(9).fill('')
    }
    newNode.cells[4] = currentNode.cells[cellIndex] // Center = clicked cell

    setHistory([...history, newNode])
  }

  // Update text in current cell
  const updateCell = (cellIndex, text) => {
    const newHistory = [...history]
    newHistory[newHistory.length - 1].cells[cellIndex] = text
    setHistory(newHistory)
  }

  // Go back one level
  const goBack = () => {
    if (history.length > 1) {
      setHistory(history.slice(0, -1))
    }
  }

  // Go to root
  const goHome = () => {
    setHistory([history[0]])
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Mandalart</h1>
        <div className="nav-buttons">
          <button
            onClick={goHome}
            disabled={history.length === 1}
            className="btn-nav"
          >
            🏠 Home
          </button>
          <button
            onClick={goBack}
            disabled={history.length === 1}
            className="btn-nav"
          >
            ← Back
          </button>
        </div>
      </div>

      <MandalartGrid
        cells={currentNode.cells}
        onCellClick={navigateToChild}
        onCellChange={updateCell}
      />

      <div className="breadcrumb">
        레벨 {history.length}
      </div>
    </div>
  )
}

export default App
