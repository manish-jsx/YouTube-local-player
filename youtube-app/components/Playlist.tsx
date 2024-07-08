"use client";
import React from "react";
import { VideoFile } from "@/app/types";

interface PlaylistProps {
    videos: VideoFile[];
    setCurrentVideo: (video: VideoFile) => void;
}

export default function Playlist({ videos, setCurrentVideo }: PlaylistProps) {
    return (
        <div className="playlist-container">
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium">
                    Playlist
                </div>
                <div className="collapse-content">
                    <ul className="menu rounded-box">
                        {videos.map((video) => (
                            <li
                                key={video.path}
                                className="hover:bg-gray-100"
                                onClick={() => setCurrentVideo(video)}
                            >
                                {video.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

