document.getElementById('convertBtn').onclick = convertToAscii;
document.getElementById('videoInput').onchange = loadVideo;

const videoElement = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const charSet = [' ', 'M', '&', 'W']; // Characters used for ASCII
let videoFrames = [];

// Load the video file
function loadVideo(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoElement.src = url;
    }
}

// Convert the video to ASCII art
async function convertToAscii() {
    videoElement.play();
    videoElement.muted = true;

    const fps = 10;
    const frameDuration = 1000 / fps;
    const whammyEncoder = new Whammy.Video(fps);

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    while (!videoElement.ended) {
        await new Promise(resolve => setTimeout(resolve, frameDuration));
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const frameData = context.getImageData(0, 0, canvas.width, canvas.height);
        const asciiFrame = convertFrameToAscii(frameData);
        drawAsciiFrame(asciiFrame);
        whammyEncoder.add(canvas);
    }

    // Generate and download MP4
    const output = whammyEncoder.compile();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(output);
    link.download = 'ascii-video.mp4';
    link.click();
}

// Convert image data to ASCII art
function convertFrameToAscii(imageData) {
    const { data, width, height } = imageData;
    let asciiStr = '';

    for (let y = 0; y < height; y += 8) { // Sample every 8th pixel for speed
        for (let x = 0; x < width; x += 4) {
            const i = (y * width + x) * 4;
            const brightness = getBrightness(data[i], data[i + 1], data[i + 2]);
            const charIndex = Math.floor((brightness / 255) * (charSet.length - 1));
            asciiStr += charSet[charIndex];
        }
        asciiStr += '\n';
    }
    return asciiStr;
}

// Calculate pixel brightness
function getBrightness(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Draw ASCII art on the canvas
function drawAsciiFrame(asciiStr) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '10px monospace';
    context.fillStyle = 'black';
    const lines = asciiStr.split('\n');
    lines.forEach((line, index) => {
        context.fillText(line, 0, index * 12);
    });
}
