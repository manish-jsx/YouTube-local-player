'use client';

import { useState, useEffect, createContext } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import Playlist from '@/components/Playlist';
import { VideoFile } from './types'; // Type for video data
import Header from '@/components/Header'; // Import the Header component

interface HomeContextType {
  handleChooseFolder: () => Promise<void>;
}

export const HomeContext = createContext<HomeContextType>({
  handleChooseFolder: async () => { },
});

export default function Home() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);

  const handleChooseFolder = async () => {
    setIsLoading(true);

    try {
      const dirHandle = await window.showDirectoryPicker();
      const videoFiles: VideoFile[] = [];

      async function scanDirectory(directoryHandle: FileSystemDirectoryHandle) {
        for await (const entry of directoryHandle.values()) {
          if (entry.kind === 'file' && entry.name.endsWith('.mp4')) {
            const file = await entry.getFile();
            videoFiles.push({ name: entry.name, path: URL.createObjectURL(file) });
          } else if (entry.kind === 'directory') {
            await scanDirectory(entry);
          }
        }
      }

      await scanDirectory(dirHandle);
      videoFiles.sort((a, b) => a.name.localeCompare(b.name));

      setVideos(videoFiles); // Update with all found videos
      setCurrentVideo(videoFiles[0] || null); // Play the first video if available
    } catch (error) {
      console.error("Error selecting folder:", error); // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if localStorage has data on initial render
    const storedVideos = localStorage.getItem('videos');
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
      setCurrentVideo(JSON.parse(storedVideos)[0] || null); // Set the first video as current
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Update localStorage whenever videos change
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const handleFileChangeFromHeader = async (file: File) => {
    const videoFiles: VideoFile[] = [];
    videoFiles.push({ name: file.name, path: URL.createObjectURL(file) });
    setVideos(prevVideos => [...prevVideos, ...videoFiles]);
    setIsLoading(false);

    if (!currentVideo) {
      setCurrentVideo(videoFiles[0]);
    }
  };

  const value: HomeContextType = {
    videos,
    setVideos,
    isLoading,
    setIsLoading,
    currentVideo,
    setCurrentVideo
  };

  return (
   <main className="flex flex-col md:flex-row gap-4 p-4">
      <HomeContext.Provider value={{handleChooseFolder}}>
      <Playlist videos={videos} setCurrentVideo={setCurrentVideo} />
      

      {isLoading ? (
        <div className="loading loading-spinner loading-lg"></div> // Loading indicator
      ) : (
        <>
          {currentVideo && <VideoPlayer video={currentVideo} />}
        </>
      )}
      </HomeContext.Provider>
    </main>
  );
}
