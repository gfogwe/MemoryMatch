import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import AppNavigation from './Navigation'; // Make sure the path is correct

export default function App() {
    const [music, setMusic] = useState(null);

    useEffect(() => {
        const loadMusic = async () => {
            // Load the music file
            const { sound } = await Audio.Sound.createAsync(
                require('./assets/trap-loop.mp3'), // Path to your music file
                {
                    shouldPlay: true, // Start playback immediately
                    isLooping: true, // Loop the playback
                }
            );
            setMusic(sound);

            // Play the music
            await sound.playAsync();
        };

        // Call the function to load and play the music
        loadMusic();

        // Remember to unload the sound from memory when it's no longer needed.
        return () => {
            if (music) {
                music.unloadAsync();
            }
        };
    }, []);

    return <AppNavigation />;
}
