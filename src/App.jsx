import { useState, useEffect } from 'react'
import './App.css'
import MandalartGrid from './components/MandalartGrid'

const STORAGE_KEY = 'mandalart-history'

function App() {
  // Nodes map: { [nodeId]: { id: nodeId, cells: [{ text, completed }] } }
  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Check if it's the new format (object with root)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.root) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
    // Default initial state
    return {
      'root': {
        id: 'root',
        cells: Array(9).fill().map(() => ({ text: '', completed: false }))
      }
    }
  })

  // Navigation stack: array of nodeIds
  const [path, setPath] = useState(['root'])

  // Save to localStorage whenever nodes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [nodes])

  const currentNodeId = path[path.length - 1]
  const currentNode = nodes[currentNodeId] || { id: currentNodeId, cells: Array(9).fill().map(() => ({ text: '', completed: false })) }

  // Helper to check if a cell has a child node with content
  const hasChildContent = (nodeId, cellIndex) => {
    const childId = `${nodeId}-${cellIndex}`
    const childNode = nodes[childId]
    if (!childNode) return false
    // Check if any non-center cell in child node has text
    return childNode.cells.some((cell, idx) => idx !== 4 && cell.text.trim() !== '')
  }

  // Calculate completion rate for a node
  const getCompletionRate = (nodeId) => {
    const node = nodes[nodeId]
    if (!node) return 0

    const outerCells = node.cells.filter((_, idx) => idx !== 4)
    const activeCells = outerCells.filter(cell => cell.text.trim() !== '')

    if (activeCells.length === 0) return 0

    let completed = 0
    let total = 0

    node.cells.forEach((cell, idx) => {
      if (idx === 4 || cell.text.trim() === '') return

      total++

      const childId = `${nodeId}-${idx}`
      if (hasChildContent(nodeId, idx)) {
        // It's a parent task, check its completion rate
        const childRate = getCompletionRate(childId)
        if (childRate === 100) completed++
      } else {
        // It's a leaf task, check its completed status
        if (cell.completed) completed++
      }
    })

    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }

  // Navigate to a child node
  const navigateToChild = (cellIndex) => {
    if (cellIndex === 4) return

    const childId = `${currentNodeId}-${cellIndex}`

    // Create child node if it doesn't exist
    if (!nodes[childId]) {
      const newNodes = { ...nodes }
      newNodes[childId] = {
        id: childId,
        cells: Array(9).fill().map(() => ({ text: '', completed: false }))
      }
      // Sync center cell of child with clicked cell
      newNodes[childId].cells[4] = { ...currentNode.cells[cellIndex], completed: false } // Center usually doesn't have completed status itself in the same way
      setNodes(newNodes)
    }

    setPath([...path, childId])
  }

  // Update cell data
  const updateCell = (cellIndex, updates) => {
    const newNodes = { ...nodes }
    const node = { ...newNodes[currentNodeId] }
    node.cells = [...node.cells]
    node.cells[cellIndex] = { ...node.cells[cellIndex], ...updates }
    newNodes[currentNodeId] = node

    // If updating center cell, sync with parent's corresponding cell
    if (cellIndex === 4 && path.length > 1) {
      const parentId = path[path.length - 2]
      // Extract index from current node ID (e.g., "root-0" -> 0)
      const parentIndex = parseInt(currentNodeId.split('-').pop())

      const parentNode = { ...newNodes[parentId] }
      parentNode.cells = [...parentNode.cells]
      parentNode.cells[parentIndex] = { ...parentNode.cells[parentIndex], text: updates.text } // Only sync text
      newNodes[parentId] = parentNode
    }

    setNodes(newNodes)
  }

  // Go back one level
  const goBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1))
    }
  }

  // Go to root
  const goHome = () => {
    setPath(['root'])
  }

  // Backup data to JSON file
  const handleBackup = () => {
    window.open(`/backup/index.html`, '_blank')
  }

  // Get display data for the grid
  const getGridCells = () => {
    return currentNode.cells.map((cell, index) => {
      // For center cell, calculate completion rate of THIS node
      if (index === 4) {
        const rate = getCompletionRate(currentNodeId)
        return { ...cell, completionRate: rate, isCenter: true }
      }

      // For other cells, check if they are parents
      const childId = `${currentNodeId}-${index}`
      const isParent = hasChildContent(currentNodeId, index)

      if (isParent) {
        const rate = getCompletionRate(childId)
        return { ...cell, completionRate: rate, isParent: true }
      }

      return { ...cell, isParent: false }
    })
  }

  return (
    <div className="app">
      <div className="header">
        <div className="header-top">
          <h1>Mandalart</h1>
          <button
            onClick={handleBackup}
            className="btn-backup"
          >
            Backup
          </button>
        </div>
        <div className="nav-buttons">
          <button
            onClick={goHome}
            disabled={path.length === 1}
            className="btn-nav"
          >
            처음으로
          </button>
          <button
            onClick={goBack}
            disabled={path.length === 1}
            className="btn-nav"
          >
            ← Back
          </button>
        </div>
      </div>

      <MandalartGrid
        cells={getGridCells()}
        onCellClick={navigateToChild}
        onCellChange={updateCell}
      />

      <div className="breadcrumb">
        레벨 {path.length}
      </div>
    </div>
  )
}

export default App
