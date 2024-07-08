'use client';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { HomeContext } from '../app/page'; // Import the context

interface HeaderProps {
  onFileChange: (file: File) => Promise<void>;
}


export default function Header({ onFileChange }: HeaderProps) {

  const { setIsLoading, setVideos } = useContext(HomeContext)!; // Assert that context is not null
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileChange(file); // Call the callback function
      setSelectedFile(null); // Reset selectedFile
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const videoFiles = [];
      videoFiles.push({ name: selectedFile.name, path: URL.createObjectURL(selectedFile) });
      setVideos(prevVideos => [...prevVideos, ...videoFiles]);
      setIsLoading(false);
    }
  }, [selectedFile, setIsLoading, setVideos]);

  return (
    <header className="bg-base-100 p-4 shadow-md flex justify-between items-center">
      <label htmlFor="my-drawer" className="btn btn-primary drawer-button lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </label>
      <h1 id="folderName" className="text-2xl font-semibold">
        <Link href="/">My YouTube</Link>
      </h1>

      {/* File Input */}
      <input type="file" accept=".mp4" style={{ display: 'none' }} id="fileInput" onChange={handleFileChange} />

      {/* Trigger for File Input */}
      <button className="btn btn-primary" onClick={() => document.getElementById('fileInput')?.click()}>
        Add to Playlist
      </button>
    </header>
  );
}
