# blogging_Api
This api has a general endpoint that shows a list of articles that have been created by different people, and anybody that calls this endpoint, should be able to read a blog created by them or other users.

---

## Requirements
1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs.
13. The endpoint should be paginated
14. It should be filterable by state
15. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
16. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page.
17.  It should also be searchable by author, title and tags.
18.  It should also be orderable by read_count, reading_time and timestamp
19.  When a single blog is requested, the api should return the user information(the author) with the  blog. The read_count of the blog too should be updated by 1
20.  Come up with any algorithm for calculating the reading_time of the blog.
21. Write tests for all endpoints

---
## Setup
- Install NodeJS, mongodb
- pull this repo
- Install all packages
- update you .env file
- run `npm run dev`

---
## Base URL
- somehostsite.com
PORT = 4000
db = mongodb compass

## Models
1. blogModel
2. usersModel
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  username |  string |  required |
|  firstname | string  |  required|
|  lastname  |  string |  required  |
|  email     | string  |  required |
|  password |   string |  required  |
|  


### blog
| field  |  data_type | constraints  |
|---|---|---|
|  title |  date |  required |
|  state |  string |  required, default: draft, enum: ['draft', 'published'] |
|  description  |  number |  required  |
|  author     | array  |  required |
|  tags |   string | optional  |
|  Readcount |  number | optional |
|  Reading time |  string |  optional|
|  Body |  number |  required, enum: ['m', 's', 'l'] |
| Timestamp



## APIs
---

### Signup User

- Route: /signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
  "username": 'jon_doe",
}
```

- Responses

Success
```
{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe",
        "username": 'jon_doe",
    }
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "username": 'jon_doe",
}
```

- Responses

Success
```
{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
```

---
### Create blog

- Route: /userblog
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```

```
### Create blog
To get all blogs
- Route: /blogs
- Method: GET
- Header
    - Authorization: Bearer {token}
- Body: 

```
---
### Get /

- Route: /
- Method: GET
-





## Contributor
- Martins Umekwe