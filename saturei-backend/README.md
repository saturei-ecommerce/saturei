# saturei-backend
spring boot rest api for the saturei marketplace (java 17, postgresql)

## to-do

### architecture
* [ ] ddd package structure scaffold (user, listing, order, chat, review, shared) — lucas
* [ ] global exception handler — arthur
* [ ] request/response logging filter — joao

### database
* [ ] postgresql datasource and jpa configuration — santana
* [ ] flyway migrations setup — santana
* [ ] initial schema migration (users, listings, orders, messages, reviews) — santana
* [ ] seed data for local development — santana

### security
* [ ] jwt authentication (filter, provider, token generation) — joao
* [ ] spring security configuration (cors, csrf, protected routes) — joao
* [ ] password encryption (bcrypt) — arthur
* [ ] refresh token support — joao

### bounded contexts
* [ ] user bounded context (entity, repository, service) — arthur
* [ ] listing bounded context (crud, status management) — lucas
* [ ] image upload handling (storage + size optimization) — santana
* [ ] search endpoint (keyword + filters: price, location, category) — lucas
* [ ] order bounded context (cart, checkout, payment gateway hook) — lucas
* [ ] chat bounded context (websocket with stomp) — joao
* [ ] review bounded context (post-transaction rating) — arthur

### infra & devops
* [ ] dockerfile — santana
* [ ] docker-compose (app + postgres) — santana
* [ ] .env.example with required environment variables — santana
* [ ] github actions — ci (build + test on pull request) — santana
* [ ] github actions — cd (deploy on push to main) — santana
* [ ] health check endpoint via actuator — santana
