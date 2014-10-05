# Clear gen_file
with open('mongodb-gen.js', 'w') as gen_file:
	print 'Cleared mongdb-gen.js'
	gen_file.write(
		'db.artists.remove({});\n'
		'db.users.remove({});\n'
	)

# Generate artist information
with open('hetrec2011-lastfm-2k/artists.tsv', 'r') as artist_file:
	artist_file.readline()
	for line in artist_file:
		text = line.split('\t')
		artist_id = text[0].strip()
		artist_name = text[1].strip().replace('"', '')
		artist_url = text[2].strip()
		artist_pic_url = text[3].strip()

		with open('mongodb-gen.js', 'a') as gen_file:
			gen_file.write(
				'db.artists.save({'
					'_id:' + artist_id + ','
					'name:"' + artist_name + '",'
					'url:"' + artist_url + '",'
					'pictureUrl:"' + artist_pic_url + '"'
				'});\n')

# Generate users' listening count
with open('hetrec2011-lastfm-2k/user_artists.tsv', 'r') as listen_file:
	listen_file.readline()
	for line in listen_file:
		text = line.split('\t')
		user_id = text[0].strip()
		artist_id = text[1].strip()
		listen_count = text[2].strip()

		with open('mongodb-gen.js', 'a') as gen_file:
			gen_file.write(
				'db.users.update('
					'{_id:' + user_id + '},'
					'{'
						'$addToSet:{'
							'listen:{'
								'artistID:'+ artist_id + ','
								'count:' + listen_count +
							'}'
						'}'
					'},'
					'{upsert:true}'
				');\n'
			)