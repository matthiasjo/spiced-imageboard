const express = require("express");
const serveStatic = require("serve-static");
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./utils/s3");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

app.use(bodyParser.json());

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.get("/data", (req, res) => {
    db.getData()
        .then(qResponse => {
            res.json(qResponse);
        })
        .catch(err => console.log(err));
});

app.get("/get-img-info/:id", (req, res) => {
    db.getImageModal(req.params.id)
        .then(qResponse => {
            const imageModal = {
                id: qResponse.rows[0].image_id,
                description: qResponse.rows[0].description,
                url: qResponse.rows[0].url,
                username: qResponse.rows[0].username,
                title: qResponse.rows[0].title
            };
            const commentsModal = qResponse.rows;
            res.json([imageModal, commentsModal]);
        })
        .catch(err => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    console.log("THIS IS MY CONSOLE LOG", req.body);
    const title = req.body.title;
    const description = req.body.description;
    const username = req.body.username;
    const url =
        `https://s3.amazonaws.com/spiced-salt-image-board/` + req.file.filename;
    db.pushImage(url, username, title, description)
        .then(qResponse => {
            const image = {
                id: qResponse.rows[0].id,
                description: description,
                title: title,
                url: url,
                username: username,
                success: true
            };
            res.json(image);
        })
        .catch(err => console.log(err));
});

app.post("/sendComment", (req, res) => {
    const { comment, username, id } = req.body;
    db.pushComment(comment, username, id)
        .then(qResponse => {
            const newComment = {
                comment_user: username,
                comment: comment,
                image_id: id,
                comment_id: qResponse.rows[0].comment_id,
                comment_timestamp: qResponse.rows[0].comment_timestamp
            };
            res.json(newComment);
        })
        .catch(err => console.log(err));
});

app.use(serveStatic("./public"));

app.listen(port, () => console.log(`This server is listening on port ${port}`));