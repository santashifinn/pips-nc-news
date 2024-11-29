![Image of a Pipistrelle bat with red fur introducing the news](http://pipmurphy.com/nc-news-header.png)

# Project summary

- **Pip's NC News** is my first solo coding project at Northcoders, utilising what I've learned of back-end coding so far! 👩‍💻
- _So what is it?_ 🙋
- It is an API built for the purpose of accessing application data programmatically, mimicking the building of a real world back-end service and providing this information to the front-end architecture.
- _...So what is it?_ 🤔
- In more everyday terms, it's the behind-the-scenes framework for a **message-board style service**, such as Reddit, where **users can post, delete and upvote/downvote articles and comments**.

### Hosted version

- You can access the hosted version [here](https://pips-nc-news.onrender.com/api).
- The above link shows a list of possible endpoints and examples of inputs and outputs.
- If it looks distinctly un-pretty on your browser, you might need to intall an extension to format the JSON file!

### GitHub repository

- You can access the GitHub version [here](https://github.com/santashifinn/pips-nc-news).

![Image of two identical Pipistrelle bats pointing at each other](http://pipmurphy.com/nc-news-clone.png)

- If you'd like to try running this repository on your local machine 💻 , you can clone it by entering the following command in your terminal: `git clone https://github.com/santashifinn/pips-nc-news`.
- Then navigate into the folder using the command `cd pips-nc-news`.
- After that please install the required dependencies and add the required files using the commands below.

![Image of a Pipistrelle bat panicking over to-do lists](http://pipmurphy.com/nc-news-requirements.png)

## Required dependencies - minimum versions needed to run project

- **Node.js** - 2.2.0 [Please install using the command `npm install`]
- **Postgres** - 8.7.3 [Please install using the command `npm install pg`]
- **DotEnv** - 16.0.0 [Please install using the command `npm install dotenv`]
- **Express** - 4.21.1 [Please install using the command `npm install express`]

## Required files

Please create the following files in order to connect to the **test-data** and **development-data** databases locally:

- **.env.test** [Please add the text `PGDATABASE=nc_news_test` to the file.]
- **.env.development** [Please add the text `PGDATABASE=nc_news` to the file.]

![Image of a Pipistrelle bat dropping seeds](http://pipmurphy.com/nc-news-setupseed.png)

## How to set up the local database

- Please enter the command `npm run setup-dbs`.

## How to seed the local database

- Please enter the command `npm run seed`.

## How to run tests

- Please enter the command `npm tests` to run all the tests.
- These are the tests that I wrote as part of TDD (Test Driven Development), a way of working which allows software developers to build robust code that their clients can have confidence in.

![Image of a Pipistrelle bat looking questioning](http://pipmurphy.com/nc-news-endpointsqueries.png)

## Endpoints

Please enter the request `GET /api` to see a list of all available endpoints.

Available requests include:

- getting all articles※
- getting a specific article by its ID
- getting all comments on an article※
- getting a list of users
- getting a list of topics
- posting a new article
- posting a new comment on a specific article
- deleting a comment
- upvoting and downvoting articles and comments

※ When returning all articles or a list of comments on an article, the results are paginated.
The default is 10 per page, but this can be increased or decreased as wished.

## Queries

- To write a query, add the available query options listed for that request in `GET /api`.
- For example, `/api/articles?topic=coding&sort_by=author&order=desc` would return a list of articles with the topic `coding` sorted in descending order of author.

![Image of a pleased looking Pipistrelle bat](http://pipmurphy.com/nc-news-why.png)

It was a fun project with which to test my newly acquired developer skills!

It gave me practice at:

- Querying a database.
- Using a TDD approach to cover both the happy and error paths.
- Setting a RESTful API with a number of endpoints which cover CRUD operations.
- Setting up parametric endpoints.
- Handling complex queries.
- Manipulating data to respond to client requirements.
- Hosting a server and DB.

##

Please check back in the near future to see the linked front-end project! 🔗🔗

##

This portfolio project was created as part of a _Digital Skills Bootcamp in Software Engineering_ provided by [Northcoders](https://northcoders.com/)

Thank you so much to the wonderful Northcoders staff and my lovely classmates for your support and encouragement!
