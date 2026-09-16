"use client";

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { Question, pwQuestions, ashaQuestions } from '@/lib/questions';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
      const [role, setRole] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // UI State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
    
  const currentQuestions = role === 'Pregnant Woman (గర్భిణీ స్త్రీ)' ? pwQuestions : 
                           (role === 'Asha Worker (ఆశా వర్కర్)' || role === 'ANM') ? ashaQuestions : [];



  // Total steps: Intro(0) + Role(1) + Questions(length)
  const totalSteps = 2 + currentQuestions.length;

  
  const handleNext = async () => {
    if (currentStep === 1 && !role) return;
    
    // Auto-scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev - 1);
  };

  const handleRoleChange = (selectedRole: string) => {
    setRole(selectedRole);
    setAnswers({});
    // We can auto-advance when role is selected
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(2);
    }, 300);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Auto-advance for radio questions after a tiny delay for better UX
    const question = currentQuestions.find(q => q.id === questionId);
    if (question?.type === 'radio' || question?.type === 'rating') {
      setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          handleNext();
        }
      }, 400);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        role,
        answers,
        createdAt: serverTimestamp(),
      });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#14b8a6', '#8b5cf6'],
        zIndex: 9999
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error saving document: ', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / (totalSteps - 1)) * 100;
    return (

      <div className="w-full bg-gray-200 h-2 mb-6 rounded-full overflow-hidden">
        <div 
          className="bg-pink-500 h-2 transition-all duration-300 ease-out"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>
    );
  };

  if (isSubmitted) {
    return (

      <main className="min-h-screen relative overflow-hidden p-6 flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-pink-100 animate-gradient-x">
        {/* Decorative Background Blobs - All Pink Shades */}
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-rose-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-md w-full bg-pink-50/85 backdrop-blur-xl border border-pink-200 shadow-[0_20px_60px_-15px_rgba(236,72,153,0.15)] rounded-3xl p-10 text-center animate-fade-in relative z-10 flex flex-col">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mb-6 shadow-md mx-auto border border-gray-100">
            <img 
              src="/final_logo.png" 
              alt="Janani Mitra Logo" 
              className="w-[95%] h-[95%] object-contain scale-[1.1]" 
            />
          </div>
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Thank You! <br/> ధన్యవాదాలు!</h2>
          <p className="text-gray-600 mb-8 font-medium">Your feedback has been successfully submitted.</p>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              
              
              setRole('');
              setAnswers({});
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-pink-500/20 transform hover:-translate-y-0.5"
          >
            Submit Another Response
          </button>
        </div>
      </main>
    );
  }

  return (

    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-pink-50 via-rose-100 to-pink-100 animate-gradient-x">
      {/* Decorative Background Blobs - All Pink Shades */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-rose-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[10%] w-72 h-72 bg-fuchsia-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      
      <div className="max-w-xl w-full bg-pink-50/85 backdrop-blur-2xl border border-pink-200 shadow-[0_10px_60px_-10px_rgba(236,72,153,0.35)] rounded-3xl overflow-hidden min-h-[550px] flex flex-col relative z-10 animate-fade-in">
        
        {/* Clean Header with Logo and Text separated */}
        <div className="w-full relative bg-pink-50/40 flex flex-col items-center justify-center pt-8 pb-6 border-b border-pink-100 shadow-sm">
           
           <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden mb-4 shadow-md mx-auto border border-gray-100">
            <img 
              src="/final_logo.png" 
              alt="Janani Mitra Logo" 
              className="w-[95%] h-[95%] object-contain scale-[1.1]" 
            />
          </div>
           
           <div className="text-center w-full px-4 pb-1">
             <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent drop-shadow-sm pb-2 leading-normal">
               జననీ మిత్ర
             </h1>
             <h2 className="text-[11px] text-pink-500/80 font-bold tracking-widest uppercase">
               Feedback Form
             </h2>
           </div>
        </div>

        <div className="p-6 sm:p-8 flex-grow flex flex-col relative">
          {currentStep > 0 && renderProgressBar()}

          {/* STEP 0: Personal Info */}
          {/* STEP 1: Role Selection */}
          {currentStep === 1 && (
            <div className="flex-grow flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 tracking-tight mb-3">
                Welcome / స్వాగతం
              </h2>
              <p className="text-gray-500 font-medium text-sm">Please select your role to start the feedback</p>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              మీరు కిందివాటిలో ఎవరు? <br/>
              <span className="text-sm text-pink-500 font-semibold mt-1 block">Which of the following are you?</span>
            </h3>
              
              <div className="space-y-4">
                {['Asha Worker (ఆశా వర్కర్)', 'ANM', 'Pregnant Woman (గర్భిణీ స్త్రీ)'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-6 py-5 rounded-2xl border transition-all ${
                      role === r 
                        ? 'border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-400 scale-[1.01]' 
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm'
                    }`}
                  >
                    <span className={`text-base ${role === r ? 'font-semibold text-blue-700' : 'font-medium text-gray-700'}`}>
                      {r}
                    </span>
                  </button>
                ))}
              </div>

              
            </div>
          )}

          {/* STEPS 2 to N: Dynamic Questions */}
          {currentStep > 1 && (
            <div className="flex-grow flex flex-col animate-fade-in">
              {(() => {
                const questionIndex = currentStep - 2;
                const question = currentQuestions[questionIndex];
                const isLastQuestion = currentStep === totalSteps - 1;

                if (!question) return null;

                return (

                  <>
                    <div className="mb-8">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-xs font-bold tracking-wider text-blue-700 uppercase mb-4 shadow-sm">
                        Question {questionIndex + 1} of {currentQuestions.length}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 leading-relaxed whitespace-pre-line">
                        {question.text}
                      </h3>
                    </div>

                    <div className="flex-grow flex flex-col">
                      
                      {question.type === 'rating' ? (
                        <div className="space-y-4 mt-6">
                          <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleAnswerChange(question.id, star.toString())}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                  parseInt(answers[question.id] || '0') >= star
                                    ? 'bg-pink-100 text-pink-500 scale-110 shadow-md ring-2 ring-pink-300'
                                    : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
                            <span>Poor</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      ) : question.type === 'radio' && question.options ? (
                        <div className="space-y-4 mt-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleAnswerChange(question.id, option)}
                              className={`w-full text-left px-6 py-5 rounded-2xl border transition-all ${
                                answers[question.id] === option 
                                  ? 'border-blue-400 bg-blue-50 shadow-md ring-1 ring-blue-400 scale-[1.01]' 
                                  : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-base ${answers[question.id] === option ? 'font-semibold text-blue-700' : 'font-medium text-gray-700'}`}>
                                  {option}
                                </span>
                                {answers[question.id] === option && (
                                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <textarea
                            rows={6}
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-400 transition-all font-medium"
                            placeholder="Type your suggestions here... / మీ సలహాలను ఇక్కడ రాయండి..."
                          />
                        </div>
                      )}

                      <div className="mt-auto pt-10 flex space-x-4">
                        <button
                          onClick={handlePrev}
                          className="flex-1 py-4 px-4 border border-gray-200 rounded-2xl shadow-sm text-base font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        
                        {isLastQuestion ? (
                          <button
                            onClick={handleSubmit}
                              disabled={isSubmitting || ((question.type === 'radio' || question.type === 'rating') && !answers[question.id])}
                              className="flex-1 py-4 px-4 rounded-2xl shadow-lg shadow-pink-500/20 text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit'}
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            disabled={(question.type === 'radio' || question.type === 'rating') && !answers[question.id]}
                            className="flex-1 py-4 px-4 rounded-2xl shadow-lg shadow-pink-500/20 text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:opacity-50 disabled:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
      
      
    </main>
  );
}
