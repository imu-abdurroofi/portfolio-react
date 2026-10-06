import { useState, useEffect, useRef } from "react";
import LatticeLoader from './LatticeLoader';
import '../styles/LoadingScreen.css';

export default function LoadingScreen({ onDone }) {
  const [slideOut, setSlideOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    // Show loader for 2.5 seconds then slide out
    const timer = setTimeout(() => {
      setSlideOut(true);
      // After slide animation, call onDone
      setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone && onDone();
        }
      }, 700);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div 
      className="loading-screen"
      style={{
        transform: slideOut ? "translateY(-100%)" : "translateY(0)",
        opacity: slideOut ? 0 : 1,
      }}
    >
      <LatticeLoader
        status="working"
        label="Loading Portfolio"
        doneLabel="Ready"
        errorLabel="Error"
        pattern="orbit"
        grid={3}
        shape="round"
        doneColor="#22c55e"
        errorColor="#ef4444"
        cellSize={8}
        gap={3}
        fontSize={16}
        step={90}
        idleOpacity={0.15}
        glow={false}
        glowColor=""
        showTimer={false}
        color="#3b82f6"
      />
    </div>
  );
}
