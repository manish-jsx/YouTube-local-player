import { VideoFile } from '@/app/types';

interface VideoPlayerProps {
  video: VideoFile;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <div className="aspect-video rounded-lg shadow-md overflow-hidden">
      <video 
        src={video.path} 
        controls 
        className="w-full h-full object-contain" 
      />
      <p className="mt-2 text-lg font-medium">{video.name}</p>
    </div>
  );
}


