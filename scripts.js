document.getElementById('chooseFolder').addEventListener('click', async () => {
    const dirHandle = await window.showDirectoryPicker();
    const playlist = document.getElementById('playlist');
    const videoPlayer = document.getElementById('videoPlayer');
    const folderNameHeading = document.getElementById('folderName');
    const videoNameFooter = document.getElementById('videoName');

    playlist.innerHTML = ''; // Clear the playlist

    const videoFiles = [];
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

    // Sort video files (custom sorting to handle numbers in filenames)
    videoFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0], 10) || 0; // Default to 0 if no number
        const numB = parseInt(b.name.match(/\d+/)[0], 10) || 0; 
        return numA - numB;
    });

    videoFiles.forEach((entry, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = entry.name;
        a.href = '#'; // Add this line

        // Event delegation for click handling
        playlist.addEventListener('click', async (event) => {
            if (event.target.tagName === 'A') { // Check if the click is on the anchor tag
                // Remove 'active' class from all items
                const listItems = playlist.querySelectorAll('li');
                listItems.forEach(item => item.classList.remove('active'));

                // Add 'active' class to the clicked item
                event.target.parentElement.classList.add('active');

                const file = await entry.getFile();
                const url = URL.createObjectURL(file);
                videoPlayer.src = url;
                videoPlayer.load();
                videoPlayer.play();

                videoNameFooter.textContent = entry.name; 
            }
        });

        li.appendChild(a); // Append the anchor tag to the list item
        playlist.appendChild(li);

        // Autoplay the first video
        if (index === 0) {
            li.classList.add('active');
            a.click(); // Trigger the click event to start playback
        }
    });

    folderNameHeading.textContent = dirHandle.name;
});
