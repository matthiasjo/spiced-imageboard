const knox = require("knox-s3");
let secrets;
const fs = require("fs");
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    try {
        secrets = require("../secrets.json");
    } catch (err) {
        console.log(err, "NO SECRETS FILE FOUND");
    }
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "spiced-salt-image-board"
});

module.exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }

    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        console.log("s3Resonse.statusCode: ", s3Response.statusCode);
        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            // if upload was not successfull
            res.sendStatus(500);
            res.json({
                success: wasSuccessful
            });
        }
    });
};
