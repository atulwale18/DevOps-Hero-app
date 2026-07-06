import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function QuizModal() {
  const { currentQuestion, answerQuiz } = useGameStore();
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isRevealing, setIsRevealing] = React.useState(false);

  if (!currentQuestion) return null;

  const handleOptionClick = (index: number) => {
    if (isRevealing) return;
    
    setSelectedOption(index);
    setIsRevealing(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    
    setTimeout(() => {
      answerQuiz(isCorrect);
      setIsRevealing(false);
      setSelectedOption(null);
    }, 1500); // Show result for 1.5 seconds before resuming game
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden">
        
        {/* Category Header */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />
        <div className="flex justify-between items-center mb-6">
          <span className="text-blue-400 font-bold uppercase tracking-wider text-sm">
            Challenge: {currentQuestion.category}
          </span>
          <span className="text-slate-400 text-sm">System Paused</span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-white mb-8">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            
            let btnClass = "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:border-slate-500";
            let Icon = null;

            if (isRevealing) {
              if (index === currentQuestion.correctAnswer) {
                btnClass = "bg-green-900/50 border-green-500 text-green-100";
                Icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
              } else if (index === selectedOption) {
                btnClass = "bg-red-900/50 border-red-500 text-red-100";
                Icon = <XCircle className="w-5 h-5 text-red-400" />;
              } else {
                btnClass = "bg-slate-900 border-slate-800 text-slate-500 opacity-50";
              }
            } else if (selectedOption === index) {
              btnClass = "bg-blue-900/50 border-blue-500 text-blue-100";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isRevealing}
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between font-medium ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 font-bold text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                {Icon}
              </button>
            );
          })}
        </div>

        {/* Result Message */}
        {isRevealing && selectedOption !== null && (
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2">
            {selectedOption === currentQuestion.correctAnswer ? (
              <p className="text-green-400 font-bold text-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> System Override Successful! (+10 XP)
              </p>
            ) : (
              <p className="text-red-400 font-bold text-lg flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" /> Access Denied. Integrity Damaged!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
