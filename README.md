![Image of a Pipistrelle bat with red fur introducing the news](http://pipmurphy.com/nc-news-header.png)

# Project summary

**Pip's NC News** is an API built for the purpose of accessing application data programmatically, mimicking the building of a real world backend service (eg. Reddit) and providing this information to the front end architecture.

### Hosted version

You can access the hosted version [here](https://pips-nc-news.onrender.com).

### GitHub repository

You can access the GitHub version [here](https://github.com/santashifinn/pips-nc-news).

# How to clone project

- Clone this repository to your local machine using the command `git clone https://github.com/santashifinn/pips-nc-news`.
- Navigate into the folder using the command `cd pips-nc-news`.
- Install the required dependencies using the commands below.
- Ensure to add the required files listed below.

![Image of a Pipistrelle bat panicking over to-do lists](http://pipmurphy.com/nc-news-requirements.png)

## Required dependencies - minimum versions required to run project

- Node.js - 2.2.0 [Please install using the command `npm install`]
- Postgres - 8.7.3 [Please install using the command `npm install pg`]
- DotEnv - 16.0.0 [Please install using the command `npm install dotenv`]
- Express - 4.21.1 [Please install using the command `npm install express`]

## Required files to be added

Please create the following files in order to connect to the **test-data** and **development-data** databases locally:

- .env.test [Please add the text `PGDATABASE=nc_news_test` to the file.]
- .env.development [Please add the text `PGDATABASE=nc_news` to the file.]

![Image of a Pipistrelle bat dropping seeds](http://pipmurphy.com/nc-news-setupseed.png)

## How to seed local database

- Please enter `npm run setup-dbs` to set up the database.
- Please enter `npm run seed` to seed the database.

## How to run tests

- Please enter `npm tests` to run all the tests.

# Endpoints

Please enter the request `GET /api` to see a list of all available endpoints.

# Queries

To write a query, add the available query options listed for that request in `GET /api`,
eg. "_/api/articles?topic=cats&sort_by=author&order=desc_" would return a list of articles with the topic cats sorted in descending order of author.

The default sort orders are as follows:

- _articles_: descending order of date created

# Why did you do this?

For practice at:

- Querying a database.
- Using a TDD approach to cover both the happy and error paths.
- Setting a RESTful API with a number of endpoints which cover CRUD operations.
- Setting up parametric endpoints.
- Handling complex queries.
- Manipulating data to respond to client requirements.
- Hosting a server and DB.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
