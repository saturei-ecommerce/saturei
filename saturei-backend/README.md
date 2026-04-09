# saturei-backend
spring boot rest api for the saturei marketplace (java 17, postgresql)

## to-do

### architecture
* [ ] ddd package structure scaffold (user, listing, order, chat, review, shared)
* [ ] global exception handler
* [ ] request/response logging filter

### database
* [ ] postgresql datasource and jpa configuration
* [ ] flyway migrations setup
* [ ] initial schema migration (users, listings, orders, messages, reviews)
* [ ] seed data for local development

### security
* [ ] jwt authentication (filter, provider, token generation)
* [ ] spring security configuration (cors, csrf, protected routes)
* [ ] password encryption (bcrypt)
* [ ] refresh token support

### bounded contexts
* [ ] user bounded context (entity, repository, service)
* [ ] listing bounded context (crud, status management)
* [ ] image upload handling (storage + size optimization)
* [ ] search endpoint (keyword + filters: price, location, category)
* [ ] order bounded context (cart, checkout, payment gateway hook)
* [ ] chat bounded context (websocket with stomp)
* [ ] review bounded context (post-transaction rating)

### infra & devops
* [ ] dockerfile
* [ ] docker-compose (app + postgres)
* [ ] .env.example with required environment variables
* [ ] github actions — ci (build + test on pull request)
* [ ] github actions — cd (deploy on push to main)
* [ ] health check endpoint via actuator
