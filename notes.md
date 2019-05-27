SELECT id FROM images
ORDER BY id ASC
LIMIT 1

location.hash,
location.hash.slice(1),

modalId : location.hash.slice(1),

<a :href="'#' + image.id"
