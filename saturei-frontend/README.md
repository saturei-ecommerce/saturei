# saturei-frontend
next.js web client for the saturei marketplace

## to-do

### pages & features
* [x] authentication pages (login, register) — richard
* [x] social login (google/github via next-auth) — richard
* [ ] listing creation form (title, description, photos, condition, price) — pedro
* [ ] listing management page (edit, pause, delete) — pedro
* [x] search page with filters (keyword, price range, location, category) — vini hen
* [x] listing detail page — vini bel
* [x] cart and checkout flow (payment method, shipping) — vini bel
* [x] real-time chat ui (buyer ↔ seller) — vini hen
* [x] user profile and reputation (ratings display) — vini bel
* [ ] responsive layout (mobile + desktop) — pedro

### infra & devops
* [x] dockerfile — richard
* [x] .env.example with required environment variables — vini hen
* [x] github actions — ci (lint + build on pull request) — richard
* [x] github actions — cd (deploy on push to main) — pedro
