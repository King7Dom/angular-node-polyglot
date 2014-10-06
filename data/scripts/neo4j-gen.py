neo4j_gen_file = 'neo4j-gen.cql'

users = set()
query = ''

# Setup gen_file
with open(neo4j_gen_file, 'w') as gen_file:
	print 'Setup neo4j-gen.cql'
	print 'Remember to clear neo4j db before running neo4j-gen.cql'
	gen_file.write(
		'MATCH n-[r]-() DELETE n, r;\n'
	)

# Generate CREATE queries for Artist nodes
with open('hetrec2011-lastfm-2k/artists.tsv', 'r') as artist_file:
	print 'Creating queries for Artist nodes...'
	with open(neo4j_gen_file, 'a') as gen_file:
		gen_file.write(
			'CREATE CONSTRAINT ON (a:Artist) ASSERT a.id IS UNIQUE;\n'
			'CREATE INDEX ON :Artist(name);\n'
		)

	artist_file.readline()
	for line in artist_file:
		text = line.split('\t')
		artist_id = text[0].strip()
		artist_name = text[1].strip().replace('\\', '\\\\').replace('\"', '\\\"').replace('\'', '\\\'')
		artist_url = text[2].strip()
		artist_pic_url = text[3].strip()

		query += (
			'CREATE (:Artist{'
				'id:' + artist_id + ',' 
				'name:"' + artist_name + '",'
				'url:"' + artist_url + '",'
				'pictureUrl:"' + artist_pic_url + '"'
			'});\n'
		)

# Generate CREATE queries for User nodes and their listening relation with Artist
with open('hetrec2011-lastfm-2k/user_artists.tsv', 'r') as listen_file:
	print 'Creating queries for User nodes and their listening relation with Artist...'
	
	query += (
		'CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE;\n'
	)

	listen_file.readline()
	for line in listen_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		listen_count = text[2].strip()

		users.add(user_id)
		query += (
			'MATCH (a:Artist{id:' + artist_id + '}),(u:User{id:' + user_id + '}) '
			'CREATE UNIQUE (u)-[:LISTENS_TO{count:'+ listen_count +'}]->(a);\n'
		)

	with open(neo4j_gen_file, 'a') as gen_file:
		for user in users:
			gen_file.write('CREATE (:User{id:' + user + '});\n')

		gen_file.write(query)

# Generate CREATE queries for FRIENDS relations
with open('hetrec2011-lastfm-2k/user_friends.tsv', 'r') as friends_file:
	print 'Creating queries for FRIENDS relation...'
	friends_file.readline()
	for line in friends_file:
		text = line.split('\t')
		user_id = text[0].strip()
		friend_id = text[1].strip()

		users.add(user_id)

		query += (
			'MATCH (u:User{id:' + user_id + '}),(f:User{id:' + friend_id + '}) '
			'CREATE UNIQUE (u)-[:FRIENDS]-(f);\n'
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
	with open(neo4j_gen_file, 'a') as gen_file:
		gen_file.write('CREATE INDEX ON :TAGGED(tag)')

	user_tags_file.readline()
	for line in user_tags_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		tag = tags[text[2].strip()]
		timestamp = text[3].strip()

		users.add(user_id)

		query +=(
				'MATCH (u:User{id:' + user_id + '}),(a:Artist{id:' + artist_id + '}) '
				'USING INDEX u:User(id) '
				'USING INDEX a:Artist(id) '
				'CREATE (u)-[:TAGGED{tag:\"' + tag + '\",timestamp:' + timestamp + '}]->(a);\n'
			)

with open(neo4j_gen_file, 'a') as gen_file:
	for user in users:
		gen_file.write('CREATE (:User{id:' + user + '});\n')

	gen_file.write(query)
