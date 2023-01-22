# House of Games API

### Link to hosted API - https://game-reviews-k7fw.onrender.com/api

# Setup

If you are cloning this repo before you run it localy you will need to create a ".env.development" and a ".env.test" file to connect to your production / test databases respectivly. These files should contain a script to set the database to be used for example:

```psql
PGDATABASE=<'database name'>
```

# Endpoints

## GET requests

- ### /api
- ### /api/reviews
- ### /api/reviews/:review_id
- ### /api/reviews/:review_id/comments
- ### /api/categories
- ### /api/users

## POST requests

- ### /api/reviews/:review_id/comments
- ### /api/categories

## PATCH requests

- ### /api/reviews/:review_id/votes

# Tables

## Reviews

- title
- designer
- owner
- review_img_url
- review_body
- category
- created_at
- votes

## Categories

- slug (category name)
- description

## Users

- username
- name
- avatar_url

## Comments

- body
- votes
- author
- review_id
- created_at

# Tasks

- update endpoints.json
