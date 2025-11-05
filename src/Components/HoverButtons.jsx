import React from 'react';
import useSound from 'use-sound';
import hover1 from './assets/sounds/hover1.mp3';
import hover2 from './assets/sounds/hover2.mp3';
import hover3 from './assets/sounds/hover3.mp3';

function HoverButtons() {
  // Initialize sounds
  const [playHover1] = useSound(hover1, { volume: 0.5 });
  const [playHover2] = useSound(hover2, { volume: 0.5 });
  const [playHover3] = useSound(hover3, { volume: 0.5 });

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <button
        onMouseEnter={playHover1}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Button 1
      </button>

      <button
        onMouseEnter={playHover2}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Button 2
      </button>

      <button
        onMouseEnter={playHover3}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Button 3
      </button>
    </div>
  );
}

export default HoverButtons;
