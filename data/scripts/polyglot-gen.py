mongodb_gen_file = 'polymongo-gen.js'
neo4j_gen_file = 'polyneo-gen.cql'

users = set()
mongodb_query = ''
neo4j_query = ''

# Setup gen_file
with open(mongodb_gen_file, 'w') as gen_file:
	print 'Setup mongdb-gen.js'
	gen_file.write(
		'db.artists.remove({});\n'
	)

# Setup gen_file
with open(neo4j_gen_file, 'w') as gen_file:
	print 'Setup neo4j-gen.cql'
	print 'Remember to clear neo4j db before running neo4j-gen.cql'
	gen_file.write(
		'CREATE CONSTRAINT ON (a:Artist) ASSERT a.id IS UNIQUE;\n'
		'CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE;\n'
		'CREATE INDEX ON :Artist(name);\n'
		'CREATE INDEX ON :TAGGED(tag);\n'
	)

with open('hetrec2011-lastfm-2k/artists.tsv', 'r') as artist_file:
	artist_file.readline()
	for line in artist_file:
		text = line.split('\t')
		artist_id = text[0].strip()
		artist_name = text[1].strip().replace('\\', '\\\\').replace('\"', '\\\"').replace('\'', '\\\'')
		artist_url = text[2].strip()
		artist_pic_url = text[3].strip()

		# Setup artists collection in mongodb
		mongodb_query += (
			'db.artists.save({'
				'_id:' + artist_id + ','
				'name:"' + artist_name + '",'
				'url:"' + artist_url + '",'
				'pictureUrl:"' + artist_pic_url + '"'
			'});\n')

		# Setup artist node in neo4j
		neo4j_query += (
			'CREATE (a:Artist{id:' + artist_id + ',name:"' + artist_name + '"}) '
			'RETURN a'
			';\n'
		)


# Generate CREATE queries for User nodes and their listening relation with Artist
with open('hetrec2011-lastfm-2k/user_artists.tsv', 'r') as listen_file:
	print 'Creating queries for User nodes and their listening relation with Artist...'

	listen_file.readline()
	for line in listen_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		listen_count = text[2].strip()

		users.add(user_id)
		neo4j_query += (
			'MATCH (a:Artist{id:' + artist_id + '}),(u:User{id:' + user_id + '}) '
			'USING INDEX u:User(id) '
			'USING INDEX a:Artist(id) '
			'CREATE UNIQUE (u)-[l:LISTENS_TO{count:'+ listen_count +'}]->(a) '
			'RETURN u,l,a'
			';\n'
		)

# Generate CREATE queries for FRIENDS relations
with open('hetrec2011-lastfm-2k/user_friends.tsv', 'r') as friends_file:
	print 'Creating queries for FRIENDS relation...'
	friends_file.readline()
	for line in friends_file:
		text = line.split('\t')
		user_id = text[0].strip()
		friend_id = text[1].strip()

		users.add(user_id)

		neo4j_query += (
			'MATCH (u:User{id:' + user_id + '}),(f:User{id:' + friend_id + '}) '
			'USING INDEX u:User(id) '
			'USING INDEX f:User(id) '
			'CREATE UNIQUE (u)-[r:FRIENDS]-(f) '
			'RETURN u,r,f'
			';\n'
		)

#load tags
tags = dict()
with open('hetrec2011-lastfm-2k/tags.tsv', 'r') as tag_list:
	print 'Generating tag dictionary...'
	tag_list.readline()
	for line in tag_list:
		text = line.split('\t')
		tags[text[0].strip()] = text[1].strip()

# Generate CREATE queries for user tagging relations
with open('hetrec2011-lastfm-2k/user_taggedartists-timestamps.tsv', 'r') as user_tags_file:
	print 'Creating queries for user tagging relations...'

	user_tags_file.readline()
	for line in user_tags_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		tag = tags[text[2].strip()]
		timestamp = text[3].strip()

		users.add(user_id)

		neo4j_query +=(
				'MATCH (u:User{id:' + user_id + '}),(a:Artist{id:' + artist_id + '}) '
				'USING INDEX u:User(id) '
				'USING INDEX a:Artist(id) '
				'CREATE (u)-[t:TAGGED{tag:\"' + tag + '\",timestamp:' + timestamp + '}]->(a) '
				'RETURN u,t,a'
				';\n'
			)

with open(neo4j_gen_file, 'a') as gen_file:
	for user in users:
		gen_file.write('CREATE (u:User{id:' + user + '}) RETURN u;\n')

	gen_file.write(neo4j_query)

with open(mongodb_gen_file, 'a') as gen_file:
	gen_file.write(mongodb_query)

