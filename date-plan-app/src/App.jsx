import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const FloatingEmojis = () => {
  const emojis = ['💖', '✨', '💫', '🤍'];
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const newElements = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}vw`,
      animationDuration: `${5 + Math.random() * 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${1.5 + Math.random()}rem`,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-[-10%] animate-float-up opacity-0"
          style={{
            left: el.left,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay,
            fontSize: el.fontSize,
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedDateIdea, setSelectedDateIdea] = useState('');
  
  const [noClicks, setNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ position: 'relative' });

  const nextStep = () => setCurrentStep((prev) => prev + 1);

  useEffect(() => {
    if (currentStep === 4) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [currentStep]);

  const handleNoInteraction = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    setNoClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5 && newCount < 10) {
        const randomTop = Math.random() * 70 + 15;
        const randomLeft = Math.random() * 70 + 15;
        setNoPosition({
          position: 'fixed',
          top: `${randomTop}vh`,
          left: `${randomLeft}vw`,
          zIndex: 50,
          transition: 'all 0.2s ease',
        });
      }
      return newCount;
    });
  };

  const handleYesClick = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff0000', '#ff69b4', '#ff1493', '#ffc0cb'],
      ticks: 200,
    });
    
    setTimeout(() => {
      nextStep();
    }, 1200);
  };

  const foodOptions = [
    { label: 'Sushi', emoji: '🍣' },
    { label: 'Tacos', emoji: '🌮' },
    { label: 'Burger + Fries', emoji: '🍔' },
    { label: 'French Fries', emoji: '🍟', favorite: true },
    { label: 'Pasta', emoji: '🍝' },
    { label: 'Pizza', emoji: '🍕' },
  ];

  const vibeOptions = [
    { label: 'Fancy', emoji: '🎩' },
    { label: 'Cozy', emoji: '🛋️' },
    { label: 'Adventurous', emoji: '🎢' },
    { label: 'Chill', emoji: '☕' },
    { label: 'Sunset', emoji: '🌅' },
    { label: 'Movie', emoji: '🎬' },
  ];

  const placeOptions = [
    { label: 'VR Chennai', emoji: '🎬' },
    { label: 'Marina Mall', emoji: '🛍️' },
    { label: 'Marina Beach', emoji: '🌊' },
    { label: 'Besant Nagar', emoji: '🌅' },
    { label: 'Fries + Chill', emoji: '🍟' },
    { label: 'Café Date', emoji: '☕' },
    { label: 'Fun Mall', emoji: '🎢' },
    { label: 'Long Drive', emoji: '🚗' },
  ];

  const dateIdeaOptions = [
    { label: 'Movie Date', emoji: '🎬' },
    { label: 'Beach Date', emoji: '🌊' },
    { label: 'Food Date', emoji: '🍟' },
    { label: 'Mall Date', emoji: '🛍️' },
    { label: 'Coffee Date', emoji: '☕' },
    { label: 'Sunset Date', emoji: '🌅' },
  ];

  const allSelected = selectedDate && selectedTime && selectedFood && selectedVibe && selectedPlace && selectedDateIdea;

  return (
    <div className="relative min-h-screen text-white flex justify-center w-full">
      <FloatingEmojis />
      
      <main className="relative z-10 w-full max-w-[420px] px-6 py-12 flex flex-col justify-center min-h-screen transition-all duration-700 ease-in-out h-[100dvh] overflow-y-auto overflow-x-hidden">
        
        {/* Step 1 */}
        <div className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center p-6 ${currentStep === 1 ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 pointer-events-none absolute hidden'}`}>
          <div className="text-[100px] animate-pulse-fast mb-6">💖</div>
          <h1 className="text-4xl font-bold text-center mb-2 drop-shadow-lg">Mini, will u go on a date with me?? 💖</h1>
          <p className="text-white/80 text-lg mb-12 font-medium">(no is not an option, Mini bestie 💅)</p>
          
          <div className="flex flex-col items-center justify-center gap-6 w-full max-w-[300px]">
            <button 
              onClick={handleYesClick}
              style={{ transform: `scale(${Math.min(1 + noClicks * 0.15, 2.5)})` }}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] transition-all w-full z-10"
            >
              💖 YES omg 🥺
            </button>
            
            {noClicks < 10 && (
              <button
                onClick={handleNoInteraction}
                onMouseEnter={noClicks >= 5 ? handleNoInteraction : undefined}
                onTouchStart={noClicks >= 5 ? handleNoInteraction : undefined}
                style={noPosition}
                className={`bg-white/10 border border-white/20 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-white/20 active:bg-white/30 transition-all ${noClicks >= 5 ? 'animate-shake' : ''}`}
              >
                No 🙄
              </button>
            )}
          </div>

          {noClicks >= 10 && (
            <p className="mt-8 text-pink-200 font-medium text-center" style={{ animation: 'fade-in-up 1s both' }}>
              Nice try. There was never a No option anyway 😌💖
            </p>
          )}
        </div>

        {/* Step 2 */}
        <div className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center p-6 ${currentStep === 2 ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 pointer-events-none absolute hidden'}`}>
          <div className="text-[100px] mb-6 animate-bounce">😳</div>
          <h1 className="text-5xl font-black text-center mb-2 drop-shadow-lg tracking-tight">WAIT.</h1>
          <h2 className="text-2xl font-semibold mb-6 text-pink-200 text-center">Mini actually said YES??</h2>
          <p className="text-center text-lg text-white/90 mb-12 leading-relaxed">
            okay okay don't panic, play it cool...<br/>
            <span className="italic opacity-70 text-sm mt-2 block">I'm not playing it cool.</span>
          </p>
          <button 
            onClick={nextStep}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-[0_0_20px_rgba(217,70,239,0.6)] hover:scale-105 active:scale-95 transition-all w-full max-w-[300px]"
          >
            So... let's plan it ✨
          </button>
        </div>

        {/* Step 3 */}
        <div className={`transition-all duration-700 w-full pb-10 ${currentStep === 3 ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-8 pointer-events-none hidden'}`}>
          <div className="text-center mb-8 mt-4">
            <h1 className="text-3xl font-bold mb-2">Let's plan our date 💖</h1>
            <p className="text-pink-200">Pick whatever makes you happiest.</p>
          </div>

          <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-6 space-y-6 w-full">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-white/90">When?</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-white/90">Time?</label>
                <input 
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">What kind of date should this be?</label>
              <div className="grid grid-cols-3 gap-2">
                {dateIdeaOptions.map((idea) => (
                  <button
                    key={idea.label}
                    onClick={() => setSelectedDateIdea(idea.label)}
                    className={`p-2 rounded-xl border text-sm flex flex-col items-center gap-1 transition-all ${
                      selectedDateIdea === idea.label 
                        ? 'bg-pink-500/30 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)] scale-105' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{idea.emoji}</span>
                    <span className="text-xs text-center">{idea.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">Where should we go, Mini?</label>
              <div className="grid grid-cols-4 gap-2">
                {placeOptions.map((place) => (
                  <button
                    key={place.label}
                    onClick={() => setSelectedPlace(place.label)}
                    className={`p-2 rounded-xl border text-[10px] leading-tight flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedPlace === place.label 
                        ? 'bg-pink-500/30 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)] scale-105' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{place.emoji}</span>
                    <span className="text-center">{place.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">What are we eating?</label>
              <div className="grid grid-cols-3 gap-2">
                {foodOptions.map((food) => (
                  <button
                    key={food.label}
                    onClick={() => setSelectedFood(food.label)}
                    className={`p-2 rounded-xl border text-sm flex flex-col items-center gap-1 transition-all ${
                      selectedFood === food.label 
                        ? 'bg-pink-500/30 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.4)] scale-105' 
                        : food.favorite ? 'bg-yellow-500/20 border-yellow-400/50 hover:bg-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-xs text-center">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-white/90">What's the vibe?</label>
              <div className="grid grid-cols-3 gap-2">
                {vibeOptions.map((vibe) => (
                  <button
                    key={vibe.label}
                    onClick={() => setSelectedVibe(vibe.label)}
                    className={`p-2 rounded-xl border text-sm flex flex-col items-center gap-1 transition-all ${
                      selectedVibe === vibe.label 
                        ? 'bg-purple-500/30 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.4)] scale-105' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{vibe.emoji}</span>
                    <span className="text-xs text-center">{vibe.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={nextStep}
              disabled={!allSelected}
              className={`font-bold text-xl py-4 px-10 rounded-full transition-all w-full shadow-lg ${
                (!allSelected)
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95'
              }`}
            >
              That's perfect ✨
            </button>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`transition-all duration-700 w-full ${currentStep === 4 ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-8 pointer-events-none hidden'}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Mini, it's official ❤️</h1>
            <p className="text-pink-200">
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} @ {selectedTime && (
                parseInt(selectedTime.split(':')[0]) > 12 
                  ? `${parseInt(selectedTime.split(':')[0]) - 12}:${selectedTime.split(':')[1]} PM` 
                  : `${selectedTime} AM`
              )}
            </p>
          </div>

          <div className="space-y-4 mb-10 w-full flex flex-col pb-8">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] self-start rounded-2xl rounded-tl-sm p-4 max-w-[85%] animate-float-up" style={{animation: 'none', animationName: 'fade-in-up', animationDuration: '0.5s', animationFillMode: 'both', animationDelay: '0.2s'}}>
              <p className="text-white/90">We're going for a <span className="font-bold text-pink-300">{selectedDateIdea}</span> at <span className="font-bold text-purple-300">{selectedPlace}</span> ✨</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] self-end rounded-2xl rounded-tr-sm p-4 max-w-[85%] bg-blue-500/40 border-blue-400/30 text-right" style={{animation: 'none', animationName: 'fade-in-up', animationDuration: '0.5s', animationFillMode: 'both', animationDelay: '1s'}}>
              <p className="text-white">And yes, <span className="font-bold">{selectedFood}</span> is included because I know you like French fries 🍟</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] self-start rounded-2xl rounded-tl-sm p-4 max-w-[85%]" style={{animation: 'none', animationName: 'fade-in-up', animationDuration: '0.5s', animationFillMode: 'both', animationDelay: '1.8s'}}>
              <p className="text-white/90">Be ready by <span className="font-bold text-pink-300">{selectedTime && (parseInt(selectedTime.split(':')[0]) > 12 ? `${parseInt(selectedTime.split(':')[0]) - 12}:${selectedTime.split(':')[1]} PM` : `${selectedTime} AM`)}</span> — I'm coming to get you 🚗💨</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] self-end rounded-2xl rounded-tr-sm p-4 max-w-[85%] bg-pink-500/40 border-pink-400/30 text-right" style={{animation: 'none', animationName: 'fade-in-up', animationDuration: '0.5s', animationFillMode: 'both', animationDelay: '2.6s'}}>
              <p className="text-white">Glad you didn't say no, Mini 🤍</p>
            </div>
          </div>

          <p className="text-center text-white/50 text-xs uppercase tracking-widest mt-4 pb-8">
            P.S. normal guys text, I made you an app, Mini.
          </p>
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}} />
        </div>
        
      </main>
    </div>
  );
}
