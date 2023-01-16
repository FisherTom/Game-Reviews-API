# House of Games API

## Setup

If you are cloning this repo before you run it localy you will need to create a ".env.development" and a ".env.test" file to connect to your production / test databases respectivly. These files should contain a script to set the database to be used for example:

```psql
PGDATABASE=<'database name'>
```

## task 3 /api/categories

Responds with:

- an array of category objects, each of which should have the following properties:
  - `slug`
  - `description`

As this is the first endpoint you will need to set up your testing suite.

Errors handled.
