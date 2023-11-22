document.getElementById('chooseFolder').addEventListener('click', async () => {
            const dirHandle = await window.showDirectoryPicker();
            const playlist = document.getElementById('playlist');
            const videoPlayer = document.getElementById('videoPlayer');
            const folderNameHeading = document.getElementById('folderName');
            const videoNameFooter = document.getElementById('videoName'); // New line

            // Clear the existing list
            playlist.innerHTML = '';

            async function scanDirectory(directoryHandle, parentList) {
                const folderItem = document.createElement('li');
                const folderName = document.createElement('span');
                folderName.textContent = directoryHandle.name;
                folderItem.appendChild(folderName);

                const sublist = document.createElement('ul');
                folderItem.appendChild(sublist);

                parentList.appendChild(folderItem);

                for await (const entry of directoryHandle.values()) {
                    if (entry.kind === 'file' && entry.name.endsWith('.mp4')) {
                        const videoItem = document.createElement('li');
                        videoItem.textContent = entry.name;
                        videoItem.addEventListener('click', async () => {
                            const file = await entry.getFile();
                            const url = URL.createObjectURL(file);
                            videoPlayer.src = url;
                            videoPlayer.load();
                            videoPlayer.play();

                            // Update the video name in the footer
                            videoNameFooter.textContent = entry.name; // New line
                        });
                        sublist.appendChild(videoItem);
                    } else if (entry.kind === 'directory') {
                        await scanDirectory(entry, sublist);
                    }
                }
            }

            await scanDirectory(dirHandle, playlist);

            // Set the folder name as the heading text
            folderNameHeading.textContent = dirHandle.name;
        });
