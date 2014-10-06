// Browse basic information about any artist
MATCH (artist:Artist {id: })
RETURN artist.name, artist.url, artist.pictureUrl;

// Listening count
MATCH (user:User {id: }), (artist:Artist {id: })
CREATE UNIQUE (user)-[listen:LISTENS_TO]->(artist)
SET listen.count = coalesce(listen.count, 0) + 1
RETURN listen.count;

// Specify other users as friend
MATCH (user:User {id: }), (friend:User {id: })
CREATE UNIQUE (user)-[:FRIENDS]-(friend);

// Find friends of user by id
MATCH (:User {id: })-[:FRIENDS]-(friend:User)
RETURN friend.id;

// Assign tags to any artist by users
MATCH (user:User {id: }), (artist:Artist {id: })
CREATE (user)-[:TAGGED {tag: tag, timestamp:time}]->(artist);

// Recommend artist base on listening count of friends
MATCH (user:User {id: })-[:FRIENDS]-(friend:User)-[listen:LISTENS_TO]->(artist:Artist)
WHERE NOT (user)-[:LISTENS_TO]->(artist)
RETURN artist.id, artist.name, sum(listen.count)
ORDER BY sum(listen.count) DESC
LIMIT 5

// Recommend artist base on number of friends listening to the artist
MATCH (user:User {id: })-[:FRIENDS]-(friend:User)-[listen:LISTENS_TO]->(artist:Artist)
WHERE NOT (user)-[:LISTENS_TO]->(artist)
RETURN artist.id, artist.name, count(listen)
ORDER BY count(listen) DESC
LIMIT 5

// Recommend artist base on tags
MATCH (:User {id: })-[queryTag:TAGGED]->(:Artist)
WITH queryTag.tag AS userTag LIMIT 1
MATCH (user:User)-[artistTag:TAGGED]->(artist:Artist)
WHERE artistTag.tag = userTag AND NOT (:User {id: })-[:LISTENS_TO]->(artist)
WITH artist, artistTag.tag AS resultTag
MATCH (:User)-[listen:LISTENS_TO]->(artist)
RETURN artist.id, artist.name, resultTag, count(listen) AS Unique_Listener
ORDER BY count(listen) DESC
LIMIT 5