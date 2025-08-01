import { useState, useEffect, useRef } from 'react';
import './MusicControls.css';

/*
 * MusicControls – Plays looping background music on the profile page.
 * Features:
 * 1. Auto-plays "Profile Music 1" on mount.
 * 2. Mute / un-mute toggle persists in localStorage (key: profileMusicMuted).
 * 3. Track switcher toggles between two tracks and persists choice (key: profileMusicTrack).
 */
function MusicControls() {
  const tracks = {
    track1: '/music/profile-music-1.flac',
    track2: '/music/profile-music-2.flac',
    track3: '/music/profile-music-3.flac',
  };

  const initialMuted = JSON.parse(localStorage.getItem('profileMusicMuted') ?? 'false');
  const initialTrack = localStorage.getItem('profileMusicTrack') ?? 'track1';

  const [muted, setMuted] = useState(initialMuted);
  const [track, setTrack] = useState(initialTrack);
  const audioRef = useRef(null);

  // Create the Audio element whenever the track changes for  looping
  useEffect(() => {
// Tear down previous instance if any
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(tracks[track]);
    audio.loop = true;
    audioRef.current = audio;

    if (!muted) {
      // play() returns a promise – ignore errors (e.g. autoplay restrictions)
      audio.play().catch(() => {/* autoplay prevented */});
    }

    // Persist currently chosen track
    localStorage.setItem('profileMusicTrack', track);

    // Cleanup when component unmounts
    return () => {
      audio.pause();
    };
  }, [track]);

  // Respond to mute / unmute
  useEffect(() => {
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {}); /* autoplay prevented */
    }
    localStorage.setItem('profileMusicMuted', JSON.stringify(muted));
  }, [muted]);

  const toggleMute = () => setMuted(prev => !prev);
  const switchTrack = () =>
    setTrack(prev => {
      if (prev === 'track1') return 'track2';
      if (prev === 'track2') return 'track3';
      return 'track1'; // when prev === 'track3' or unknown
    });

  return (
    <div className="music-controls">
      <button
        className="music-button"
        onClick={toggleMute}
        aria-label={muted ? 'Play music' : 'Mute music'}
      >
        {muted ? '⏯' : '▶'}
      </button>
      <button
        className="music-button"
        onClick={switchTrack}
        aria-label="Switch track"
      >
        ⏭
      </button>
    </div>
  );
}

export default MusicControls; 