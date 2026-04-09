# saturei-backend
spring boot rest api for the saturei marketplace (java 17, postgresql)

## to-do

* [ ] ddd package structure scaffold (user, listing, order, chat, review, shared)
* [ ] postgresql datasource and jpa configuration
* [ ] user bounded context (entity, repository, service)
* [ ] jwt authentication (filter, provider, token generation)
* [ ] spring security configuration (cors, csrf, protected routes)
* [ ] listing bounded context (crud, status management)
* [ ] image upload handling (storage + size optimization)
* [ ] search endpoint (keyword + filters: price, location, category)
* [ ] order bounded context (cart, checkout, payment gateway hook)
* [ ] chat bounded context (websocket with stomp)
* [ ] review bounded context (post-transaction rating)
* [ ] global exception handler
