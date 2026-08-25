"use client";

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp,   getDocs } from 'firebase/firestore';

type Question = {
  id: string;
  text: string;
  type: 'radio' | 'text' | 'rating';
  options?: string[];
};

const pwQuestions: Question[] = [
  {
    id: 'pw_q1',
    text: `1. జననీ మిత్ర యాప్లో రిజిస్ట్రేషన్ ప్రక్రియ సులభంగా ఉందా?
Is the registration process in the Janani Mitra app easy?`,
    type: 'radio',
    options: ['Easy (సులభం)', 'Somewhat Difficult (కొంత కష్టంగా ఉంది)', 'Difficult (కష్టంగా ఉంది)']
  },
  {
    id: 'pw_q2',
    text: `2. యాప్లో ప్రతిరోజూ మీరు తీసుకున్న ఆహారాన్ని నమోదు చేయడం సులభంగా ఉందా?
Is it easy to log the food you eat every day in the app?`,
    type: 'radio',
    options: ['Easy (సులభం)', 'Somewhat Difficult (కొంత కష్టంగా ఉంది)', 'Difficult (కష్టంగా ఉంది)']
  },
  {
    id: 'pw_q3',
    text: `3. మీరు తిన్న ఆహారాన్ని యాప్‌లో వెతికినప్పుడు, మీరు దానిని సులభంగా కనుగొనగలుగుతున్నారా?
When you look for the food you ate, are you able to find it in the app?`,
    type: 'radio',
    options: ['Yes, easily (అవును, సులభంగా దొరుకుతుంది)', "Sometimes I can't find it (కొన్నిసార్లు దొరకదు)", "Often I can't find it (చాలాసార్లు దొరకదు)"]
  },
  {
    id: 'pw_q4',
    text: `4. మీరు యాప్‌లో శాఖాహారం (వెజ్) లేదా మాంసాహారం (నాన్-వెజ్) తింటారో సెట్ చేయగలిగారా?
Were you able to set whether you eat veg or non-veg in the app?`,
    type: 'radio',
    options: ['Yes, easily (అవును, సులభంగా సెట్ చేశాను)', 'With some difficulty (కొంత కష్టంగా సెట్ చేశాను)', "I don't know how (ఎలా చేయాలో తెలియదు)"]
  },
  {
    id: 'pw_q5',
    text: `5. జననీ మిత్ర యాప్ లో ఫుడ్ స్కానర్ ఉపయోగించడం సులభమేనా?
Is it easy to use food scanner in Janani Mitra App?`,
    type: 'radio',
    options: ['Very useful (చాలా ఉపయోగకరమైనది)', 'Not useful (ఉపయోగకరమైనది కాదు)', 'I have not used it yet (నేను ఇంకా ఉపయోగించలేదు)']
  },
  {
    id: 'pw_q6',
    text: `6. యాప్లోని ఆహార చిత్రాలు మీకు ఆహార పదార్థాలను గుర్తించడానికి సహాయపడుతున్నాయా?
Do the food images in the app help you identify the food items?`,
    type: 'radio',
    options: ['Very Helpful (చాలా సహాయపడుతున్నాయి)', 'Helpful (సహాయపడుతున్నాయి)', 'Somewhat Helpful (కొంతవరకు సహాయపడుతున్నాయి)', 'Not Helpful (సహాయపడటం లేదు)']
  },
  {
    id: 'pw_q7',
    text: `7. యాప్లో మీ రోజువారీ ఆహార వివరాలను చూడటం మీకు ఉపయోగకరంగా ఉందా?
Is it helpful for you to view your daily food details in the app?`,
    type: 'radio',
    options: ['Helpful (ఉపయోగకరంగా ఉంది)', 'Somewhat Helpful (కొంతవరకు ఉపయోగకరంగా ఉంది)', 'Not Helpful (ఉపయోగకరంగా లేదు)']
  },
  {
    id: 'pw_q8',
    text: `8. యాప్లో మీ ఆహార నమోదు ప్రక్రియను పూర్తి చేయడానికి ఎక్కువ సమయం పడుతుందా?
Does it take a lot of time to complete your food logging in the app?`,
    type: 'radio',
    options: ['No, it is Quick (లేదు, త్వరగా పూర్తవుతుంది)', 'Takes Some Time (కొంత సమయం పడుతుంది)', 'Takes a Lot of Time (చాలా సమయం పడుతుంది)']
  },
  {
    id: 'pw_q9',
    text: `9. జననీ మిత్ర యాప్ను ప్రతిరోజూ ఉపయోగించడం మీకు సౌకర్యంగా ఉందా?
Are you comfortable using the Janani Mitra app every day?`,
    type: 'radio',
    options: ['Yes (అవును)', 'Sometimes (కొన్నిసార్లు)', 'No (కాదు)']
  },
  {
    id: 'pw_q10',
    text: `10. గత వారంలో, మీరు ఎన్ని రోజులు మీ ఆహారాన్ని యాప్‌లో నమోదు చేశారు?
In the last week, how many days did you add your food?`,
    type: 'radio',
    options: ['Every day (ప్రతిరోజూ)', 'Most days (చాలా రోజులు)', 'A few days (కొన్ని రోజులు)', 'I could not (నేను నమోదు చేయలేకపోయాను)']
  },
  {
    id: 'pw_q11',
    text: `11. మీరు ఆహారాన్ని నమోదు చేయని రోజుల్లో, దానికి కారణం ఏమిటి?
On the days you did not add food, what was the reason?`,
    type: 'radio',
    options: ['Phone was not with me (ఫోన్ నా వద్ద లేదు)', 'I forgot (నేను మర్చిపోయాను)', 'It felt difficult (కష్టంగా అనిపించింది)', 'I was unwell (నాకు అనారోగ్యంగా ఉంది)', 'I added every day (నేను ప్రతిరోజూ నమోదు చేశాను)']
  },
  {
    id: 'pw_q12',
    text: `12. జననీ మిత్ర యాప్‌తో మీ మొత్తం అనుభవాన్ని రేట్ చేయండి:
Rate your overall experience with the Janani Mitra app (Out of 5 stars):`,
    type: 'rating'
  }
];

const ashaQuestions: Question[] = [
  {
    id: 'asha_q1',
    text: `1. ఒక కొత్త తల్లిని రిజిస్టర్ చేయడానికి మీకు ఎంత సమయం పడుతుంది?\nHow long does it take you to register one new mother?`,
    type: 'radio',
    options: ['Under 5 minutes (5 నిమిషాలలోపు)', '5 to 10 minutes (5 నుండి 10 నిమిషాలు)', 'More than 10 minutes (10 నిమిషాల కంటే ఎక్కువ)']
  },
  {
    id: 'asha_q2',
    text: `2. తల్లి ప్రతిరోజూ యాప్‌ను తెరిచి తాను తిన్న ఆహారాన్ని నమోదు చేయగలుగుతోందా?\nIs the mother able to open the app and log her food every day?`,
    type: 'radio',
    options: ['Always (ఎల్లప్పుడూ)', 'Most of the Time (చాలా సమయాల్లో)', 'Sometimes (అప్పుడప్పుడు)', 'Not Able to Do It (చేయలేకపోతుంది)']
  },
  {
    id: 'asha_q3',
    text: `3. గర్భిణీ స్త్రీల కోసం IFA మాత్రలను ట్రాక్ చేయడం ఉపయోగకరంగా ఉందని మీరు భావిస్తున్నారా?\nDo you think tracking IFA tablets for pregnant women is useful?`,
    type: 'radio',
    options: ['Very Useful and Needed (చాలా ఉపయోగకరం మరియు అవసరం)', 'Useful but Not Essential (ఉపయోగకరం కానీ తప్పనిసరి కాదు)', 'Not Very Useful (అంత ఉపయోగకరం కాదు)', 'Not Needed (అసలు అవసరం లేదు)']
  },
  {
    id: 'asha_q4',
    text: `4. "Your Baby" స్క్రీన్‌లో శిశువు వివరాలు మీకు ఉపయోగకరంగా ఉన్నాయా?\nIs the "Your Baby" screen showing the baby's details helpful to you?`,
    type: 'radio',
    options: ['Helpful (ఉపయోగకరం)', 'Somewhat Helpful (కొంత వరకు ఉపయోగకరం)', 'Not Helpful (ఉపయోగకరం కాదు)']
  },
  {
    id: 'asha_q5',
    text: `5. మీ PIN ఉపయోగించి ASHA Mode (ASHA Visit)లోకి లాగిన్ అవ్వగలుగుతున్నారా?\nAre you able to log in to ASHA Mode (ASHA Visit) using your PIN?`,
    type: 'radio',
    options: ['Yes, Easily (అవును, సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Login (లాగిన్ కాలేకపోతున్నాను)']
  },
  {
    id: 'asha_q6',
    text: `6. గత 30 రోజులకు తల్లి తీసుకున్న Food Group లను మీరు ట్రాక్ చేయగలుగుతున్నారా?\nAre you able to track the mother's food consumption by food group for the last 30 days?`,
    type: 'radio',
    options: ['Easily (సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Track (ట్రాక్ చేయలేకపోతున్నాను)']
  },
  {
    id: 'asha_q7',
    text: `7. యాప్‌ను ఉపయోగించి Food Recall ను సులభంగా చేయగలుగుతున్నారా?\nAre you able to perform a Food Recall of a mother using the app?`,
    type: 'radio',
    options: ['Easily (సులభంగా)', 'With Some Difficulty (కొంత కష్టంగా)', 'Unable to Do It (చేయలేకపోతున్నాను)']
  },
  {
    id: 'asha_q8',
    text: `8. ASHA Visit Summary మీకు ఉపయోగకరంగా ఉందా?\nIs the ASHA Visit Summary useful and easy for you to understand?`,
    type: 'radio',
    options: ['Helpful and Clear (ఉపయోగకరం మరియు స్పష్టంగా ఉంది)', 'Somewhat Helpful (కొంత ఉపయోగకరం)', 'Not Helpful (ఉపయోగకరం కాదు)']
  },
  {
    id: 'asha_q9',
    text: `9. ఒక తల్లి యాప్‌ను ఉపయోగించడం మానేసినప్పుడు, సాధారణంగా కారణం ఏమిటి?\nWhen a mother stops using the app, what is the usual reason?`,
    type: 'radio',
    options: ['No phone with her (ఆమె వద్ద ఫోన్ లేదు)', 'She forgets (ఆమె మర్చిపోతుంది)', 'She finds it hard (ఆమెకు కష్టంగా అనిపిస్తుంది)', 'She lost interest (ఆమెకు ఆసక్తి పోయింది)', 'This has not happened (ఇలా జరగలేదు)']
  },
  {
    id: 'asha_q10',
    text: `10. ఫీల్డ్‌లో యాప్‌ను ఉపయోగించడంలో అత్యంత కష్టమైన భాగం ఏమిటి?\nWhat is the hardest part of using the app in the field?`,
    type: 'radio',
    options: ['Network problem (నెట్‌వర్క్ సమస్య)', 'Login or PIN (లాగిన్ లేదా PIN సమస్య)', 'Doing the food recall (ఆహార నమోదు చేయడం)', 'Registering mothers (తల్లులను రిజిస్టర్ చేయడం)', 'Nothing, it works fine (ఏమీ లేదు, ఇది బాగా పనిచేస్తుంది)']
  },
  {
    id: 'asha_q11',
    text: `10. జననీ మిత్ర యాప్‌తో మీ మొత్తం అనుభవాన్ని రేట్ చేయండి:\nRate your overall experience with the Janani Mitra app (Out of 5 stars):`,
    type: 'rating'
  }
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
      const [role, setRole] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // UI State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  
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
          {currentStep === 0 && (
            <div className="flex-grow flex flex-col justify-center animate-fade-in space-y-7">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome / స్వాగతం</h3>
                <p className="text-gray-500 mt-2 font-medium">Please enter your details to begin</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    1. పేరు (Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:bg-white focus:ring-2 focus:ring-pink-400 focus:border-transparent text-black placeholder-gray-400 transition-all font-medium"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    2. ఫోన్ నెంబరు (Phone Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); 
                      setPhone(val);
                      if (phoneError && val.length === 10) setPhoneError('');
                    }}
                    className={`block w-full px-5 py-3.5 bg-white border rounded-2xl shadow-sm focus:bg-white focus:ring-2 focus:ring-pink-400 focus:border-transparent text-black placeholder-gray-400 transition-all font-medium ${phoneError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                    placeholder="10-digit mobile number"
                  />
                  {phoneError && <p className="mt-2 text-sm font-medium text-red-500">{phoneError}</p>}
                </div>
              </div>

              <div className="mt-auto pt-8">
                <button
                  onClick={handleNext}
                  disabled={isCheckingPhone || !name.trim() || phone.length !== 10}
                  className="w-full py-4 px-4 rounded-2xl shadow-lg shadow-pink-500/20 text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isCheckingPhone ? 'Checking...' : 'Start Feedback'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Role Selection */}
          {currentStep === 1 && (
            <div className="flex-grow flex flex-col justify-center animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-8 text-center tracking-tight">
                3. ఈ క్రింది వారిలో మీరు ఎవరు?<br/><span className="text-sm text-blue-600 uppercase tracking-wide mt-2 block font-semibold">Which of the following are you?</span>
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
