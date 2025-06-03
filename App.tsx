
import React, { useState, useCallback, useEffect } from 'react';
import { TarotCard, ReadingStep } from './types';
import { CELTIC_CROSS_POSITIONS, TAROT_DECK } from './constants';
// import { drawUniqueCards } from './services/tarotService'; // No longer used
import { getInterpretation } from './services/geminiService';
import { CardDisplay } from './components/CardDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

// SVG Refresh Icon Component
const RefreshIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

// Placeholder for un-drawn cards
const PlaceholderCard: React.FC<{ position: string; isNextToDraw?: boolean }> = ({ position, isNextToDraw }) => (
  <div 
    className={`bg-card-bg/40 border-2 ${isNextToDraw ? 'border-mystic-purple animate-pulse' : 'border-border-color/30 border-dashed'} rounded-lg p-4 shadow-md h-full flex flex-col justify-center items-center min-h-[120px] transition-all duration-300`}
    aria-label={`Placeholder for ${position}`}
  >
    <h3 className="text-xs font-semibold text-dark-text/60 mb-1 truncate text-center">{position}</h3>
    {isNextToDraw && <p className="text-xs text-mystic-purple-light mt-1">Next to Draw</p>}
    {!isNextToDraw && <p className="text-xs text-dark-text/40 mt-1">(Empty)</p>}
  </div>
);


const App: React.FC = () => {
  const [readingStep, setReadingStep] = useState<ReadingStep>(ReadingStep.PreDraw);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [currentDrawIndex, setCurrentDrawIndex] = useState<number>(0);
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
      console.warn("API_KEY is not available. Interpretations will fail.");
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);

  const initializeDeckAndDrawing = useCallback(() => {
    setError(null);
    const newShuffledDeck = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    setShuffledDeck(newShuffledDeck);
    setDrawnCards([]);
    setCurrentDrawIndex(0);
    setInterpretation('');
    setUserQuestion('');
    setReadingStep(ReadingStep.Drawing);
  }, []);

  const handleStartDrawingProcess = useCallback(() => {
    initializeDeckAndDrawing();
  }, [initializeDeckAndDrawing]);

  const handleDrawNextCard = useCallback(() => {
    if (currentDrawIndex < 10 && shuffledDeck.length > currentDrawIndex) {
      setError(null);
      const nextCard = shuffledDeck[currentDrawIndex];
      setDrawnCards(prev => [...prev, nextCard]);
      const newIndex = currentDrawIndex + 1;
      setCurrentDrawIndex(newIndex);
      if (newIndex === 10) {
        setReadingStep(ReadingStep.QuestionTime);
      }
    } else {
      setError("Error: No more cards to draw or deck not initialized.");
      setReadingStep(ReadingStep.QuestionTime); // Fallback if something went wrong
    }
  }, [currentDrawIndex, shuffledDeck]);
  
  const handleReShuffleAll = useCallback(() => {
    // This effectively restarts the drawing process
    initializeDeckAndDrawing();
  }, [initializeDeckAndDrawing]);


  const handleGetReading = useCallback(async () => {
    if (!userQuestion.trim()) {
      setError("Please enter your question.");
      return;
    }
    if (apiKeyMissing) {
      setError("API Key is missing. Cannot fetch interpretation. Please ensure the API_KEY environment variable is set.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setInterpretation('');

    try {
      const result = await getInterpretation(drawnCards, CELTIC_CROSS_POSITIONS, userQuestion);
      setInterpretation(result);
      setReadingStep(ReadingStep.InterpretationReady);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred while fetching the interpretation.");
       if (err instanceof Error && (err.message.includes("API key not valid") || err.message.includes("API Key is not configured") || err.message.includes("API Key is missing"))) {
        setApiKeyMissing(true); // Ensure UI reflects this critical error
      }
    } finally {
      setIsLoading(false);
    }
  }, [userQuestion, drawnCards, apiKeyMissing]);

  const handleReset = useCallback(() => {
    setReadingStep(ReadingStep.PreDraw);
    setShuffledDeck([]);
    setDrawnCards([]);
    setCurrentDrawIndex(0);
    setUserQuestion('');
    setInterpretation('');
    setError(null);
    setIsLoading(false);
    // Re-check API key status
    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
  }, []);
  
  const renderContent = () => {
    if (apiKeyMissing && readingStep !== ReadingStep.PreDraw && readingStep !== ReadingStep.Drawing) {
       // Only show critical API key error if past initial drawing stages and trying to get interpretation or already failed
      return (
        <div className="text-center p-8">
          <ErrorMessage message="CRITICAL: API_KEY is not configured or is invalid. This application requires a valid API key to provide interpretations. Please set the API_KEY environment variable and refresh." />
          <button
            onClick={handleReset}
            className="mt-6 bg-mystic-purple/80 hover:bg-mystic-purple text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start New Reading
          </button>
        </div>
      );
    }

    switch (readingStep) {
      case ReadingStep.PreDraw:
        return (
          <div className="text-center p-8 animate-fadeIn">
            <h2 className="text-3xl font-serif font-semibold text-mystic-purple-light mb-6">Welcome to the Celtic Cross Tarot</h2>
            <p className="text-lg text-dark-text mb-8 max-w-2xl mx-auto">
              Please hold your question clearly in mind. We will draw the cards one by one.
            </p>
            <button
              onClick={handleStartDrawingProcess}
              className="bg-seer-blue hover:bg-seer-blue-light text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl"
              aria-label="Begin drawing Tarot cards"
            >
              Begin Celtic Cross Drawing
            </button>
            {apiKeyMissing && (
                <p className="mt-4 text-sm text-red-400">
                    Note: API Key for interpretations seems to be missing. Card drawing will work, but readings may fail.
                </p>
            )}
          </div>
        );

      case ReadingStep.Drawing:
        return (
          <div className="p-4 md:p-8 animate-fadeIn">
            <p className="text-center text-md text-dark-text mb-2 italic">
              {currentDrawIndex < 10 ? `Drawing card ${currentDrawIndex + 1} of 10.` : "All cards drawn."}
            </p>
            <p className="text-center text-lg text-mystic-purple-light mb-6 font-semibold">
                {currentDrawIndex < 10 ? `Next Card: ${CELTIC_CROSS_POSITIONS[currentDrawIndex]}` : "Proceed to enter your question below."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" role="list" aria-label="Tarot card positions">
              {CELTIC_CROSS_POSITIONS.map((position, index) => (
                <div key={position} style={{ animationDelay: `${index * 50}ms` }} className={drawnCards[index] ? 'animate-cardAppear' : ''} role="listitem">
                  {drawnCards[index] ? (
                    <CardDisplay name={drawnCards[index].name} position={position} />
                  ) : (
                    <PlaceholderCard position={position} isNextToDraw={index === currentDrawIndex} />
                  )}
                </div>
              ))}
            </div>
            {currentDrawIndex < 10 && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleDrawNextCard}
                  className="bg-seer-blue hover:bg-seer-blue-light text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl"
                  aria-label={`Draw card for ${CELTIC_CROSS_POSITIONS[currentDrawIndex]}`}
                >
                  Draw for: {CELTIC_CROSS_POSITIONS[currentDrawIndex]}
                </button>
              </div>
            )}
             {error && <ErrorMessage message={error} />}
             <div className="mt-6 text-center">
                <button
                    onClick={handleReset}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out text-sm"
                    aria-label="Reset and start over"
                >
                    Reset Drawing
                </button>
            </div>
          </div>
        );

      case ReadingStep.QuestionTime:
        return (
          <div className="p-4 md:p-8 animate-fadeIn">
            <p className="text-center text-lg text-dark-text mb-6 italic">
              All 10 cards have been drawn using a pseudo-random shuffle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8" role="list" aria-label="Drawn tarot cards">
              {drawnCards.map((card, index) => (
                <div key={index} className="animate-cardAppear" role="listitem">
                   <CardDisplay name={card.name} position={CELTIC_CROSS_POSITIONS[index]} />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <label htmlFor="userQuestion" className="block text-xl font-serif text-mystic-purple-light mb-3">
                Please share your question:
              </label>
              <textarea
                id="userQuestion"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="w-full max-w-xl p-3 border border-border-color rounded-lg bg-card-bg text-light-text focus:ring-2 focus:ring-seer-blue focus:border-seer-blue shadow-sm resize-none"
                rows={3}
                placeholder="E.g., What should I focus on in my career right now?"
                aria-label="Enter your question for the tarot reading"
              />
              {error && <ErrorMessage message={error} />}
              <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={handleReShuffleAll} 
                  className="flex items-center justify-center gap-2 bg-transparent hover:bg-mystic-purple/20 text-mystic-purple-light font-semibold py-3 px-6 border border-mystic-purple rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  aria-label="Re-shuffle all cards"
                  disabled={isLoading}
                >
                  <RefreshIcon />
                  Re-Shuffle All Cards
                </button>
                <button
                  onClick={handleGetReading}
                  disabled={isLoading || apiKeyMissing || drawnCards.length < 10}
                  className="bg-seer-blue hover:bg-seer-blue-light text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Get my tarot reading"
                >
                  {isLoading ? <LoadingSpinner /> : "Get My Reading"}
                </button>
              </div>
               {apiKeyMissing && (
                <p className="mt-4 text-sm text-red-400">
                    Cannot get reading: API Key is missing or invalid.
                </p>
            )}
            </div>
          </div>
        );

      case ReadingStep.InterpretationReady:
        return (
          <div className="p-4 md:p-8 animate-fadeIn">
            <h2 className="text-3xl font-serif font-semibold text-mystic-purple-light mb-4 text-center">Your Reading</h2>
            <div className="mb-6 p-4 bg-card-bg/50 border border-border-color rounded-lg shadow">
              <h3 className="text-xl font-semibold text-seer-blue-light mb-2">Your Question:</h3>
              <p className="text-dark-text italic">{userQuestion}</p>
            </div>
            
            <div className="mb-6 p-4 bg-card-bg/50 border border-border-color rounded-lg shadow">
               <h3 className="text-xl font-semibold text-seer-blue-light mb-2">Drawn Cards:</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 text-sm">
                {drawnCards.map((card, index) => (
                    <div key={index} className="p-2 bg-card-bg rounded shadow-sm">
                        <p className="font-semibold text-light-text">{CELTIC_CROSS_POSITIONS[index]}:</p>
                        <p className="text-dark-text">{card.name}</p>
                    </div>
                ))}
               </div>
            </div>

            <div className="prose prose-invert max-w-none bg-card-bg p-6 rounded-lg shadow-xl prose-p:text-dark-text prose-headings:text-mystic-purple-light">
              <h3 className="text-xl font-semibold text-seer-blue-light mb-3">Interpretation:</h3>
              {interpretation.split(/\\n|\n/).map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">{paragraph.trim()}</p>
              ))}
            </div>
            {error && <ErrorMessage message={error} />}
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="bg-mystic-purple hover:bg-mystic-purple/80 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                aria-label="Start a new tarot reading"
              >
                Start New Reading
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-night-bg flex flex-col items-center justify-center p-4 selection:bg-mystic-purple selection:text-white">
      <header className="w-full max-w-5xl text-center py-6 mb-2">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-seer-blue-light to-mystic-purple-light">
          Celtic Cross Tarot
        </h1>
      </header>
      <main className="w-full max-w-5xl bg-card-bg/30 backdrop-blur-md rounded-xl shadow-2xl border border-border-color/50 overflow-hidden">
        {renderContent()}
      </main>
       <footer className="w-full max-w-5xl text-center py-6 mt-2">
        <p className="text-sm text-dark-text/70">
          Tarot readings are for entertainment and reflection. Trust your intuition.
        </p>
      </footer>
    </div>
  );
};

export default App;
