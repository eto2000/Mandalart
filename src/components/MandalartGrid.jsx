import { useState } from 'react'
import './MandalartGrid.css'

function MandalartGrid({ cells, onCellClick, onCellChange }) {
    const [editingCell, setEditingCell] = useState(null)

    const handleTextChange = (index, value) => {
        onCellChange(index, { text: value })
    }

    const handleCompletionChange = (index, completed) => {
        onCellChange(index, { completed })
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.target.blur()
        }
    }

    return (
        <div className="mandalart-container">
            <div className="mandalart-grid">
                {cells.map((cell, index) => (
                    <div
                        key={index}
                        className={`cell ${index === 4 ? 'center-cell' : 'outer-cell'} ${cell.completed ? 'completed' : ''}`}
                    >
                        {/* Completion Checkbox for Leaf Nodes */}
                        {!cell.isCenter && !cell.isParent && cell.text.trim() !== '' && (
                            <input
                                type="checkbox"
                                className="completion-checkbox"
                                checked={cell.completed}
                                onChange={(e) => handleCompletionChange(index, e.target.checked)}
                            />
                        )}

                        {/* Completion Rate for Parent Nodes */}
                        {!cell.isCenter && cell.isParent && (
                            <div className="completion-rate parent-rate">
                                {cell.completionRate}%
                            </div>
                        )}

                        {/* Center Cell Content */}
                        {cell.isCenter && (
                            <div className="center-content">
                                <div className="completion-rate center-rate">
                                    {cell.completionRate}%
                                </div>
                            </div>
                        )}

                        <input
                            type="text"
                            value={cell.text}
                            onChange={(e) => handleTextChange(index, e.target.value)}
                            onFocus={() => setEditingCell(index)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder={index === 4 ? '주제' : '하위 항목'}
                            className={`text-input ${editingCell === index ? 'editing' : ''}`}
                        />

                        {/* Navigation Button */}
                        {index !== 4 && cell.text.trim() !== '' && (
                            <button
                                className="nav-btn"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onCellClick(index)
                                }}
                                title="이동"
                            >
                                🔍
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MandalartGrid
