import React, { useRef, useEffect, useState } from "react";
import { IconButton, Slider } from "@material-ui/core";
import { PlayArrow, Pause, Speed, VolumeUp, VolumeOff } from "@material-ui/icons";
import styled, { keyframes } from "styled-components";

const LS_NAME = 'audioMessageRate';

// Animação de pulsação para o botão de play/pause
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Container principal do player
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(145deg, #6fa8dc, #3d85c6); /* Gradiente azul claro */
  padding: 8px;
  border-radius: 6px;
  color: white;
  width: 300px;
  height: auto;
`;

// Controles do player
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  width: 100%;
`;

// Botão de play/pause estilizado
const PlayPauseButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px;
  animation: ${({ isPlaying }) => (isPlaying ? pulse : "none")} 1.5s infinite;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

// Barra de progresso estilizada
const ProgressBar = styled(Slider)`
  color: white;
  width: 100%;

  .MuiSlider-thumb {
    width: 10px;
    height: 10px;
    background-color: white;
  }

  .MuiSlider-track {
    background-color: white;
  }

  .MuiSlider-rail {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

// Controles de volume e velocidade
const SecondaryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: space-between;
`;

// Botão de volume estilizado
const VolumeButton = styled(IconButton)`
  color: white;
  padding: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .MuiSvgIcon-root {
    font-size: 18px;
  }
`;

// Botão de velocidade estilizado
const SpeedButton = styled(IconButton)`
  color: white;
  padding: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .MuiSvgIcon-root {
    font-size: 18px;
  }
`;

// Exibição do tempo
const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9); /* Texto mais claro */
  margin-bottom: 6px;
`;

// Função para formatar o tempo em mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioModal = ({ url }) => {
    const audioRef = useRef(null);
    const [audioRate, setAudioRate] = useState(parseFloat(localStorage.getItem(LS_NAME) || "1"));
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Atualiza a taxa de reprodução no localStorage
    useEffect(() => {
        audioRef.current.playbackRate = audioRate;
        localStorage.setItem(LS_NAME, audioRate);
    }, [audioRate]);

    // Atualiza o tempo atual e a duração do áudio
    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Alternar entre play e pause
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    // Alternar a velocidade de reprodução
    const toggleRate = () => {
        const rates = [0.5, 1, 1.5, 2];
        const currentIndex = rates.indexOf(audioRate);
        const newRate = rates[(currentIndex + 1) % rates.length];
        setAudioRate(newRate);
    };

    // Atualizar o volume
    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        audioRef.current.volume = newValue;
        setIsMuted(newValue === 0);
    };

    // Alternar entre mudo e desmudo
    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume;
        } else {
            audioRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };

    // Atualizar o tempo do áudio ao arrastar a barra de progresso
    const handleSeek = (event, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };

    // Obter a fonte do áudio (compatível com iOS)
    const getAudioSource = () => {
        let sourceUrl = url;

        if (isIOS) {
            sourceUrl = sourceUrl.replace(".ogg", ".mp3");
        }

        return (
            <source src={sourceUrl} type={isIOS ? "audio/mp3" : "audio/ogg"} />
        );
    };

    return (
        <PlayerContainer>
            <TimeDisplay>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </TimeDisplay>
            <Controls>
                <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                </PlayPauseButton>
                <ProgressBar
                    value={currentTime}
                    max={duration}
                    onChange={handleSeek}
                    aria-labelledby="audio-seek-slider"
                />
            </Controls>
            <SecondaryControls>
                <VolumeButton onClick={toggleMute}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                </VolumeButton>
                <Slider
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={1}
                    step={0.1}
                    aria-labelledby="volume-slider"
                    style={{ width: "70px", color: "white" }}
                />
                <SpeedButton onClick={toggleRate}>
                    <Speed /> {audioRate}x
                </SpeedButton>
            </SecondaryControls>
            <audio ref={audioRef} style={{ display: "none" }}>
                {getAudioSource()}
            </audio>
        </PlayerContainer>
    );
};

export default AudioModal;