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
                title: qResponse.rows[0].title,
                created_at: qResponse.rows[0].created_at
            };
            let commentsModal = qResponse.rows[0].commentsArr;
            let tempComms = commentsModal.reverse();

            res.json([imageModal, tempComms]);
        })
        .catch(err => console.log(err));
});

app.get("/get-more-img/:direction/:lastid", (req, res) => {
    console.log("LAST ID", req.params.lastid);
    if (req.params.direction == "backward") {
        db.getMoreImages(req.params.lastid)
            .then(qResponse => {
                res.json(qResponse);
            })
            .catch(err => console.log(err));
    } else if (req.params.direction == "forward") {
        db.getLessImages(req.params.lastid)
            .then(qResponse => {
                res.json(qResponse);
            })
            .catch(err => console.log(err));
    }
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
                username: username,
                comment: comment,
                image_id: id,
                id: qResponse.rows[0].id,
                created_at: qResponse.rows[0].created_at
            };
            res.json(newComment);
        })
        .catch(err => console.log(err));
});

app.use(serveStatic("./public"));

app.listen(port, () => console.log(`This server is listening on port ${port}`));
