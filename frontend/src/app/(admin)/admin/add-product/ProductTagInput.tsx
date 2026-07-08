"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
};

const ProductTagInput = ({ value = [], onChange }: Props) => {
  const [input, setInput] = useState("");

  // Add Tag
  const addTag = (tag: string) => {
    const trimmed = tag.trim();

    if (!trimmed) return;

    // prevent duplicate
    if (value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput("");
  };

  // Remove Tag
  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  //  Handle Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(input);
    }

    // backspace delete last tag
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="border rounded-lg p-2 bg-white flex flex-wrap gap-2">
      
      {/* Tags */}
      {value.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-md text-sm"
        >
          {tag}
          <button onClick={() => removeTag(tag)}>
            <X size={14} />
          </button>
        </div>
      ))}

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type..."
        className="flex-1 outline-none min-w-[120px]"
      />
    </div>
  );
};

export default ProductTagInput;