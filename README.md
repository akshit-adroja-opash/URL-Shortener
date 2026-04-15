# URL Shortener

A Bitly-style URL shortener built with:

- `backend/`: Node.js, Express, MongoDB, Mongoose, JWT, Joi
- `frontend/`: React, Vite, React Router

## Features

- Signup and login with JWT + bcrypt password hashing
- `POST /api/links` to create a short link
- `GET /api/links` to list the current user's links with click counts
- `GET /api/links/:id` to fetch one link plus its last 20 clicks
- `DELETE /api/links/:id` to delete only the owner's link
- `GET /r/:slug` public redirect endpoint with click logging


### Backend

`backend/.env`.
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
JWT_SECRET=replace-with-a-long-random-secret


### Frontend

 `frontend/.env`.

```env
VITE_API_ENDPOINT=http://localhost:5000/api
```

Default demo credentials:

- Email: `.com`
- Password: `password123`

### 5. Run the backend

```bash
cd backend
npm run dev
```

Backend runs at `http://localhost:5000`.

### 6. Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Reviewer Quick Start

```powershell
cd backend
npm install
npm run dev
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Then log in with:

- Email: `test@gmail.com`
- Password: `test@123`

## API Examples With curl

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \

```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
```

Save the returned `token`, then use it below as `YOUR_JWT`.

### Create a short link

```bash
curl -X POST http://localhost:5000/api/links \
```

### List the current user's links

```bash
curl http://localhost:5000/api/links \
```

### Get one link with the last 20 clicks

```bash
curl http://localhost:5000/api/links/LINK_ID_HERE \
```

### Delete a link

```bash
curl -X DELETE http://localhost:5000/api/links/LINK_ID_HERE \
```

### Public redirect

```bash
curl -i http://localhost:5000/r/SLUG_HERE
```
