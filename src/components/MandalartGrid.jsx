import { useState } from 'react'
import './MandalartGrid.css'

function MandalartGrid({ cells, onCellClick, onCellChange }) {
    const [editingCell, setEditingCell] = useState(null)

    const handleCellClick = (index) => {
        if (index === 4) {
            // Center cell: just focus for editing
            setEditingCell(index)
        } else {
            // Non-center: navigate
            onCellClick(index)
        }
    }

    const handleCellChange = (index, value) => {
        onCellChange(index, value)
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            setEditingCell(null)
            // If not center cell, navigate on Enter
            if (index !== 4) {
                onCellClick(index)
            }
        }
    }

    return (
        <div className="mandalart-container">
            <div className="mandalart-grid">
                {cells.map((text, index) => (
                    <div
                        key={index}
                        className={`cell ${index === 4 ? 'center-cell' : 'outer-cell'}`}
                        onClick={() => handleCellClick(index)}
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => handleCellChange(index, e.target.value)}
                            onFocus={() => setEditingCell(index)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder={index === 4 ? '주제' : ''}
                            className={editingCell === index ? 'editing' : ''}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MandalartGrid
