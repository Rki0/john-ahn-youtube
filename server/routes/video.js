const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // mime type 체크하여 원하는 타입만 필터링

  if (file.mimetype == "video/mp4") {
    cb(null, true);
  } else {
    cb({ msg: "mp4 파일만 업로드 가능합니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

router.post("/uploads", (req, res) => {
  // save video file from client to server

  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

// router.post("/uploadVideo", (req, res) => {
//   // save video info from client to DB
//   const video = new Video(req.body);

//   video.save((err, doc) => {
//     if (err) {
//       return res.status(400).json({ success: false, err });
//     }

//     return res.status(200).json({ success: true });
//   });
// });

module.exports = router;
