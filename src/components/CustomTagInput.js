import React, { useState } from 'react';

function CustomTagInput({ tags, selected, onAdd, onToggle }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const val = inputValue.trim();
    if (val) {
      onAdd(val);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div>
      <div className="custom-input-wrapper">
        <input
          className="custom-input"
          type="text"
          placeholder="Add adjective…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={handleAdd} title="Add tag" aria-label="Add tag">
          +
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="tags-list">
          {tags.map(tag => (
            <button
              key={tag}
              className={`tag custom ${selected.has(tag) ? 'selected' : ''}`}
              onClick={() => onToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-hint">Type an adjective, then press Enter or +</p>
      )}
    </div>
  );
}

export default CustomTagInput;
