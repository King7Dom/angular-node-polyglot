neo4j_gen_file = 'neo4j-gen.cql'

# Setup gen_file
with open(neo4j_gen_file, 'w') as gen_file:
	print 'Setup neo4j-gen.cql'
	print 'Remember to clear neo4j db before running neo4j-gen.cql'
	gen_file.write(
		'MATCH n-[r]-() DELETE n, r;\n'
	)

# Generate CREATE queries for Artist nodes
with open('hetrec2011-lastfm-2k/artists.tsv', 'r') as artist_file:
	artist_file.readline()
	for line in artist_file:
		text = line.split('\t')
		artist_id = text[0].strip()
		artist_name = text[1].strip().replace('"', '')
		artist_url = text[2].strip()
		artist_pic_url = text[3].strip()

		with open(neo4j_gen_file, 'a') as gen_file:
			gen_file.write(
				'CREATE (:Artist{'
					'id:' + artist_id + ',' 
					'name:"' + artist_name + '",'
					'url:"' + artist_url + '",'
					'pictureUrl"' + artist_pic_url + '"'
				'});\n'
			)

# Generate CREATE queries for User nodes and their listening relation with Artist
with open('hetrec2011-lastfm-2k/user_artists.tsv', 'r') as listen_file:
	listen_file.readline()
	for line in listen_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		listen_count = text[2].strip()

		with open(neo4j_gen_file, 'a') as gen_file:
			gen_file.write(
				#TODO MATCH user as well to prevent duplicate user
				'MATCH (a:Artist{id:' + artist_id + '}) '
				'CREATE UNIQUE (:User{id:' + user_id + '})'
				'-[:LISTENS_TO{count:'+ listen_count +'}]'
				'->(a);\n'
			)
