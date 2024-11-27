# Northcoders News API

**Project summary**

An API built for the purpose of accessing application data programmatically, mimicking the building of a real world backend service (eg. Reddit) and providing this information to the front end architecture.

**Hosted version**
_https://pips-nc-news.onrender.com_

**GitHub repository**
_https://github.com/santashifinn/pips-nc-news_

**How to clone project**
- Clone this repository to your local machine using the command "_git clone https://github.com/santashifinn/pips-nc-news_".
- Navigate into the folder using the command "_cd pips-nc-news_".
- Install the required dependencies using the commands below.
- Ensure to add the required files listed below.

**Required dependencies - minimum versions required to run project**

- Node.js - 2.2.0 [Please install using the command "_npm install_"]
- Postgres - 8.7.3 [Please install using the command "_npm install pg_"]
- DotEnv - 16.0.0 [Please install using the command "_npm install dotenv_"]
- Express - 4.21.1 [Please install using the command "_npm install express_"]

**Required files to be added**
Please create the following files in order to connect to the **test-data** and **development-data** databases locally:

- .env.test [Please add the text "*PGDATABASE=nc_news_test*" to the file.]
- .env.development [Please add the text "*PGDATABASE=nc_news*" to the file.]
- .env.production [Please add the text "*DATABASE_URL=postgresql://postgres.oynyhjsxwofzftyiyfhl:KTSaKOyfDdaQ8oAR@aws-0-eu-west-2.pooler.supabase.com:6543/postgres*" to the file.]

**How to seed local database**

- Please enter "_psql -f ./db/setup.sql_" to setup the database.
- Please enter "_node ./db/seeds/run-seed.js_" to seed the database.

**How to run tests**

- Please enter "_npm tests_" to run all the tests.

**Endpoints**
Please enter the request "_GET /api_" to see a list of all available endpoints.

**Queries**
To write a query, add the available query options listed for that request in "_GET /api_",
eg. "*/api/articles?topic=cats&sort_by=author&order=desc*" would return a list of articles with the topic cats sorted in descending order of author.

The default sort orders are as follows:

- _articles_: descending order of date created

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
