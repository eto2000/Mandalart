import { useState } from 'react'
import './MandalartGrid.css'

function MandalartGrid({ cells, onCellClick, onCellChange }) {
    const [editingCell, setEditingCell] = useState(null)

    const handleCellChange = (index, value) => {
        onCellChange(index, value)
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            // Blur the input to save the current value
            e.target.blur()
        }
    }

    return (
        <div className="mandalart-container">
            <div className="mandalart-grid">
                {cells.map((text, index) => (
                    <div
                        key={index}
                        className={`cell ${index === 4 ? 'center-cell' : 'outer-cell'}`}
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => handleCellChange(index, e.target.value)}
                            onFocus={() => setEditingCell(index)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder={index === 4 ? '주제' : '하위 항목'}
                            className={editingCell === index ? 'editing' : ''}
                        />
                        {index !== 4 && text.trim() !== '' && (
                            <button
                                className="nav-btn"
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent cell click from triggering if we add cell click later
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
