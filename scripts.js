document.getElementById('chooseFolder').addEventListener('click', async () => {
    const dirHandle = await window.showDirectoryPicker();
    const playlist = document.getElementById('playlist');
    const videoPlayer = document.getElementById('videoPlayer');
    const folderNameHeading = document.getElementById('folderName');
    const videoNameFooter = document.getElementById('videoName'); // New line

    // Clear the existing list
    playlist.innerHTML = '';

    const videoFiles = [];

    // Recursive function to scan folders and subfolders
    async function scanDirectory(directoryHandle) {
        for await (const entry of directoryHandle.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.mp4')) {
                videoFiles.push(entry);
            } else if (entry.kind === 'directory') {
                await scanDirectory(entry);
            }
        }
    }

    await scanDirectory(dirHandle);

    // Custom sorting function to handle numeric part of filenames
    videoFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0], 10);
        const numB = parseInt(b.name.match(/\d+/)[0], 10);
        return numA - numB;
    });

    videoFiles.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = entry.name;
        li.addEventListener('click', async () => {
            const file = await entry.getFile();
            const url = URL.createObjectURL(file);
            videoPlayer.src = url;
            videoPlayer.load();
            videoPlayer.play();

            // Update the video name in the footer
            videoNameFooter.textContent = entry.name; // New line
        });
        playlist.appendChild(li);
    });

    // Set the folder name as the heading text
    folderNameHeading.textContent = dirHandle.name;
});
