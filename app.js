const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");

const videoUrl = "https://www.youtube.com/watch?v=R2OQjgqbYlI"; // replace with your desired video URL
const outputFilePath = "./my-video.mp4"; // replace with your desired output file path
const startTime = "00:20:10"
const trimVideoPath = './trimVideo.mp4'
const duration = 10;

const downloadYTVideo = (videoUrl,outputFilePath,startTime,duration,trimVideoPath) => {
  const videoStream = ytdl(videoUrl, { quality: "highest" }); // stream the video with the highest available quality
  const outputStream = fs.createWriteStream(outputFilePath); // create a write stream to save the video to a file

  videoStream.pipe(outputStream); // pipe the video stream to the output stream

  outputStream.on("finish", () => {
    ffmpeg(outputFilePath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(trimVideoPath)
      .on("end", function (err) {
        if (!err) {
          console.log("conversion Done");
        }
        const videoFilePath = trimVideoPath;
        const outputDirectory = "./directory";
        if (!fs.existsSync(outputDirectory)) {
          fs.mkdirSync(outputDirectory);
        }

        // Use fluent-ffmpeg to extract frames from the video
        ffmpeg(videoFilePath)
          .outputOptions("-vf", "fps=1")
          .on("end", function () {
            console.log("Frames extracted successfully");
            console.log("Time Taken to execute :-",(Date.now() - start)/1000);
          })
          .on("error", function (err) {
            console.log("Error extracting frames: " + err.message);
          })
          .save(path.join(outputDirectory, "frame-%d.png"));
      })
      .on("error", (err) => console.log("error: ", err))
      .run();
  });

  outputStream.on("error", (err) => {
    console.error("Error downloading video:", err);
  });
};

const convertIntoFrames = () => {
  const videoFilePath = "./my-video.mp4";
  const outputDirectory = "./directory";

  // Create the output directory if it does not exist
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  // Use fluent-ffmpeg to extract frames from the video
  ffmpeg(videoFilePath)
    .outputOptions("-vf", "fps=1")
    .on("end", function () {
      console.log("Frames extracted successfully");
    })
    .on("error", function (err) {
      console.log("Error extracting frames: " + err.message);
    })
    .save(path.join(outputDirectory, "frame-%d.png"));
};

const trimVideo = () => {
  
};
// console.timeStamp()
let start = Date.now();
downloadYTVideo(videoUrl,outputFilePath,startTime,duration,trimVideoPath);
// convertIntoFrames()
// trimVideo()
