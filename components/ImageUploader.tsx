import React, { useState, useRef, useCallback } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  label: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const processFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      setPreview(null);
      onFileSelect(null);
      if (file) {
        // Optional: notify user of invalid file type
        console.warn("Invalid file type. Please upload an image.");
      }
    }
  }, [onFileSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file || null);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file || null);
  };

  const uploaderClasses = clsx(
    "relative w-full h-64 sm:h-80 bg-gray-800 rounded-xl border-2 border-dashed flex flex-col justify-center items-center text-center p-4 cursor-pointer transition-all duration-300 group",
    {
      'border-gray-600': !isDraggingOver,
      'border-solid scale-105': isDraggingOver,
      [theme.colors.borderHover]: !isDraggingOver,
      [theme.colors.imageBorder.replace('/50', '')]: isDraggingOver,
    }
  );

  return (
    <div 
      className={uploaderClasses}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      aria-label={`Upload for ${label}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        aria-hidden="true"
      />
      {preview ? (
        <>
          <img src={preview} alt={`${label} preview`} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-xl">
             <p className="text-white font-semibold text-lg">Click or Drop to change</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-400 pointer-events-none">
          <ImageIcon className={clsx("w-16 h-16 mb-2 text-gray-500 transition-colors", theme.colors.iconHover)} />
          <span className="font-semibold text-lg">{label}</span>
          <p className="text-sm">{isDraggingOver ? 'Drop the image here!' : 'Click or drag & drop'}</p>
        </div>
      )}
    </div>
  );
};
