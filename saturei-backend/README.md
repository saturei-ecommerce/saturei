# saturei-backend
spring boot rest api for the saturei marketplace (java 17, postgresql)

## to-do

### architecture
* [x] ddd package structure scaffold (user, listing, order, chat, review, shared) — lucas
* [ ] global exception handler — arthur
* [ ] request/response logging filter — joao

### database
* [ ] postgresql datasource and jpa configuration — santana
* [ ] flyway migrations setup — santana
* [ ] initial schema migration (users, listings, orders, messages, reviews) — santana
* [ ] seed data for local development — arthur

### security
* [ ] jwt authentication (filter, provider, token generation) — joao
* [ ] spring security configuration (cors, csrf, protected routes) — joao
* [ ] password encryption (bcrypt) — arthur
* [ ] refresh token support — joao

### bounded contexts
* [ ] user bounded context (entity, repository, service) — arthur
* [x] listing bounded context (crud, status management) — lucas
* [x] image upload handling (storage + size optimization) — lucas
* [x] search endpoint (keyword + filters: price, location, category) — lucas
* [x] order bounded context (cart, checkout, payment gateway hook) — lucas
* [ ] chat bounded context (websocket with stomp) — joao
* [ ] review bounded context (post-transaction rating) — arthur

### tests
* [x] listingservice unit tests (crud, status, ownership) — lucas
* [x] imageservice unit tests (resize, validation, upload) — lucas
* [x] orderservice unit tests (checkout, cancellation, price locking) — lucas
* [ ] listingrepository integration tests (search query filters) — santana
* [ ] userservice unit tests (register, login) — arthur
* [ ] reviewservice unit tests (create, duplicate prevention) — arthur
* [ ] jwtservice unit tests (generate, validate, extract) — joao
* [ ] chatservice unit tests (conversation flow, messaging) — joao

### infra & devops
* [ ] dockerfile — santana
* [ ] docker-compose (app + postgres) — santana
* [ ] .env.example with required environment variables — santana
* [x] github actions — ci (build + test on pull request) — lucas
* [ ] github actions — cd (deploy on push to main) — joao
* [ ] health check endpoint via actuator — arthur
