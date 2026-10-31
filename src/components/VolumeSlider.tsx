'use client';

import {useEffect, useState} from 'react';
import { EventBus } from '@/game/EventBus';


export default function VolumeSlider() {
    const [volume, setVolume] = useState(.5);

    useEffect(()=> {
        const saved = localStorage.getItem('musicVolume');
        if (saved !== null) {
            const v = parseFloat(saved);
            setVolume(v);
            EventBus.emit('set-music-volume', v);
        }
    }, []);
    
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        localStorage.setItem('musicVolume', String(v));
        EventBus.emit('set-music-volume', v);
    };

    return (
        <label className="volume-slider">
            🔊
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={onChange}
            />
        </label>
    );

}