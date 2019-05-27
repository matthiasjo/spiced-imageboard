const spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/saltimgdb";
const db = spicedPg(dbUrl);

module.exports.getData = function getData() {
    return db.query(
        `SELECT * FROM images
                    ORDER BY id DESC
                    LIMIT 12`
    );
};

module.exports.pushImage = function pushImage(
    url,
    username,
    title,
    description
) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING id`,
        [url, username, title, description]
    );
};

module.exports.getImageModal = function getImageModal(id) {
    return db.query(
        `SELECT images.id AS image_id, comments.id AS comment_id, url, comment , images.created_at AS created_at, comments.created_at AS comment_timestamp, description, images.username AS username, comments.username AS comment_user ,title  FROM images
    LEFT OUTER JOIN comments ON comments.image_id = images.id
    WHERE images.id=$1 ORDER BY comments.id DESC`,
        [id]
    );
};

module.exports.pushComment = function pushComment(comment, username, imgId) {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING comments.created_at AS comment_timestamp, comments.id AS comment_id`,
        [comment, username, imgId]
    );
};
