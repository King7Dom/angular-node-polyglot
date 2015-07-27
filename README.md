# Overview

This was a project done for the purpose of a university project to demostrate a Polyglot persistence of multiple NoSQL databases.
This project uses the AngularJS as the front end framework, NodeJS to provide a simple REST API server.

NodeJS uses the Express framework, Mongoose module to communicate to a MongoDB database and neo4j-js module to communicate with a Neo4j database.

# Setup the databases

1. You will need the sample dataset [hetrec2011-lastfm-2k.zip](https://drive.google.com/file/d/0B_BMF8M6rnENTzN3S21vYWllMzQ/view?usp=sharing). Unzip and put this in `/data/scripts/` directory
2. In the same directory, run
	```python
	python polyglot-gen.py
	```
	This will generate all the cql and documents for MongoDB and Neo4j
3. Run the generated .cql and .js in the mongodb and neo4j shell.

# To setup the client app

The client app uses bower to manage all the front end dependencies, yeoman for scaffolding and grunt to run tasks. Yeoman isn't compulsory, but it is a nice tool to generate boilerplate code, I advise using it when you understand the basics of the projects.

To setup any missing tools `npm install -g bower grunt-cli yo`

1. Open a terminal tab and go to `/client/`.
2. Run `npm install & bower install`. This will setup all the dependencies.
3. Run `grunt watch`, this will start grunt to continous watch for any changes in the client app and build into the target directory, which is the `/server/dist/` folder

# To start the server app

The server app uses the Express framework and nodemon for continous build process, so you don't have to restart the server for every change

To setup any missing tools `npm install -g express nodemon`

1. Open a terminal tab and go to `/server/`.
2. Run `npm install` to install all the dependencies.
3. For development build, run `npm test`. This will use nodemon to start a node server.
4. For production build, run `npm start`, This will use node like you would on a production server.