import React from 'react';

function PresetTags({ tags, selected, onToggle }) {
  return (
    <div className="tags-list">
      {tags.map(tag => (
        <button
          key={tag}
          className={`tag preset ${selected.has(tag) ? 'selected' : ''}`}
          onClick={() => onToggle(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default PresetTags;
