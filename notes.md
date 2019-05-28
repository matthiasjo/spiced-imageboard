SELECT id FROM images
ORDER BY id ASC
LIMIT 1

location.hash,
location.hash.slice(1),

modalId : location.hash.slice(1),

<a :href="'#' + image.id"

SELECT ARRAY(SELECT rows_to_json(comments) FROM FROM comments WHERE image_id=$1 ORDER BY id DESC as "commentsArr"
FROM images WHERE id=$1

SELECT ARRAY(SELECT rows_to_json(comments) FROM FROM comments WHERE image_id=$1 ORDER BY id DESC as "commentsArr"
FROM images WHERE id=$1

(select row_to_json(comments) from comments where image_id=\$1) AS "commentsArr"

SELECT images.created_at AS created_at, description, images.username AS username, title, images.id AS image_id, url,
(SELECT ARRAY(SELECT array_agg(coms) FROM (SELECT \* FROM comments WHERE image_id=$1 ORDER BY id DESC) AS coms)) as "commentsArr"
FROM images WHERE id=$1

SELECT images.created_at AS created_at, description, images.username AS username, title, images.id AS image_id, url,
(SELECT row_to_json(comments) FROM comments WHERE image_id=2) AS "commentsArr"
FROM images WHERE id=2`

SELECT images.created_at AS created_at, description, images.username AS username, title, images.id AS image_id, url,
(SELECT ARRAY(SELECT row_to_json(comments) FROM comments WHERE image_id=$1)) AS "commentsArr"
FROM images WHERE id=$1;
