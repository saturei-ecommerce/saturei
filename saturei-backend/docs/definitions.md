# api definitions

base url: `http://localhost:8080`

---

## user
| method | endpoint | description |
|--------|----------|-------------|
| POST | `/auth/register` | register a new user |
| POST | `/auth/login` | authenticate and receive jwt |
| GET | `/users/{id}` | get user profile |

## listing
| method | endpoint | description |
|--------|----------|-------------|
| GET | `/listings` | search listings (filters: keyword, price, location, category) |
| GET | `/listings/{id}` | get listing detail |
| POST | `/listings` | create listing (auth required) |
| PUT | `/listings/{id}` | update listing (owner only) |
| PATCH | `/listings/{id}/status` | pause or reactivate listing |
| DELETE | `/listings/{id}` | delete listing (owner only) |
| POST | `/listings/{id}/images` | upload images to a listing |

## order
| method | endpoint | description |
|--------|----------|-------------|
| GET | `/orders` | list orders for authenticated user |
| GET | `/orders/{id}` | get order detail |
| POST | `/orders` | create order (checkout) |

## chat
| method | endpoint | description |
|--------|----------|-------------|
| GET | `/conversations` | list conversations for authenticated user |
| GET | `/conversations/{id}/messages` | get messages in a conversation |
| POST | `/conversations` | start a conversation about a listing |
| WS | `/ws` | websocket endpoint (stomp) |

## review
| method | endpoint | description |
|--------|----------|-------------|
| GET | `/users/{id}/reviews` | list reviews for a user |
| POST | `/orders/{id}/review` | submit review after completed order |
