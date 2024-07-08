// app/utils.ts (or app/utils.js)

import { VideoFile } from './types'; // Adjust the path if needed

export const handleChooseFolder = async (
  setIsLoading: (isLoading: boolean) => void,
  setVideos: (videos: VideoFile[]) => void,
  setCurrentVideo: (video: VideoFile | null) => void
) => {
  setIsLoading(true);
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

  // Add new videos to the existing list
  setVideos(prevVideos => [...prevVideos, ...videoFiles]);
  setIsLoading(false);

  // Play the first added video if none is currently playing
  if (!currentVideo) {
    setCurrentVideo(videoFiles[0]);
  }
};

