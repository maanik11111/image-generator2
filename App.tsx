import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { combineImages } from './services/geminiService';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useTheme } from './contexts/ThemeContext';
import { CursorFollower } from './components/CursorFollower';

const App: React.FC = () => {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleGenerate = useCallback(async () => {
    if (!image1 || !image2) {
      setError('Please upload both images before generating.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await combineImages(image1, image2);
      setGeneratedImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [image1, image2]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'couple-fusion.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
      <CursorFollower />
      <ThemeSwitcher />
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center z-10 bg-gray-700/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme.colors.gradientFrom} ${theme.colors.gradientTo}`}>
              Couple Fusion AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl">
            Upload two photos. Our AI will magically merge them into a new, single portrait in a cute couple pose.
          </p>
        </header>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ImageUploader onFileSelect={setImage1} label="Person 1" />
          <ImageUploader onFileSelect={setImage2} label="Person 2" />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!image1 || !image2 || isLoading}
          className={`w-full md:w-auto px-12 py-4 ${theme.colors.buttonBg} text-white font-bold text-lg rounded-lg shadow-lg ${theme.colors.buttonHoverBg} disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none`}
        >
          {isLoading ? 'Fusing Images...' : 'Generate Magic'}
        </button>

        <div className="w-full mt-10 text-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-800/80 backdrop-blur-sm rounded-lg">
              <LoadingSpinner />
              <p className="mt-4 text-gray-300">AI is working its magic... Please wait.</p>
            </div>
          )}
          {error && (
            <div className="bg-red-900/50 text-red-300 p-4 rounded-lg border border-red-500">
              <p className="font-bold">Oops! Something went wrong.</p>
              <p>{error}</p>
            </div>
          )}
          {generatedImage && (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-6">Your Fused Image!</h2>
              <img
                src={generatedImage}
                alt="AI generated couple"
                className={`rounded-xl shadow-2xl max-w-full h-auto border-4 ${theme.colors.imageBorder}`}
              />
              <button
                onClick={handleDownload}
                className={`mt-6 px-8 py-3 ${theme.colors.buttonBg} text-white font-semibold rounded-lg shadow-md ${theme.colors.buttonHoverBg} transition-all duration-300 ease-in-out transform hover:scale-105`}
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;