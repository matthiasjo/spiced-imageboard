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
        `SELECT  images.created_at AS created_at, description, images.username AS username, title, images.id AS image_id, url,
        (SELECT ARRAY(SELECT row_to_json(comments) FROM comments WHERE image_id=$1)) AS "commentsArr"
        FROM images WHERE id=$1`,
        [id]
    );
};

module.exports.pushComment = function pushComment(comment, username, imgId) {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING created_at, id`,
        [comment, username, imgId]
    );
};
