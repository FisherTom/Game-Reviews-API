# Game Review API

### Link to hosted API - https://game-reviews-k7fw.onrender.com/api

# Setup

If you are cloning this repo before you run it localy you will need to create a ".env.development" and a ".env.test" file to connect to your production / test databases respectivly. These files should contain a script to set the database to be used for example:

```psql
PGDATABASE=<'database name'>
```

# API Endpoints

The API has the following endpoints:

## GET /api

- Returns information about API endpoints.

## GET /api/users

- Returns an array of user objects.

```
    {users:[
        { userObject }, ...
    ]}
```

## GET /api/users/:username

- Returns a single user with the given username.

```
    {user: {
     'username': 'username',
     'name': 'name',
     'avatar_url': 'www.url.com'
    }}
```

## GET /api/categories

- Returns an array of categories.

```
    {categories:[
        { categoryObject }, ...
    ]}
```

## POST /api/categories

- Adds a new category.

## GET /api/reviews

- Returns an array of review objects.

```
    {reviews: [
        { reviewObject }, ...
    ]}
```

## GET /api/reviews/:review_id

- Returns a review with the given ID.

```
    {review:
        {
        'title': 'Title',
        'designer': 'Designer (optional)',
        'owner': 'Owner (userName)',
        'review_img_url': 'www.url.com',
        'review_body': 'Body',
        'category': 'Category (category slug)',
        'created_at': 'date',
        'votes': 'Votes'
        'comment_count': 'CommentCount'
        }
    }
```

## POST /api/reviews

- Adds a new review.

## GET /api/reviews/:review_id/comments

- Returns an array of comments with the given review ID.

## PATCH /api/reviews/:review_id

- Updates review votes.
- Responds with updated review

example request body:

```
{ inc_votes: 1 }
```

## PATCH /api/comments/:comment_id

- Updates comment votes
- Responds with updated comment

example request body:

```
{ inc_votes: 1 }
```

## POST /api/reviews/:review_id/comments

- Adds a comment with the given review ID.

## DELETE /api/comments/:comment_id

- Deletes a comment with the given comment ID.
