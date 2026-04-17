-- ============================================================
-- V1__create_schema.sql
-- Initial schema for saturei marketplace
-- ============================================================

-- Enable UUID generation (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    avatar_url  VARCHAR(512),
    created_at  TIMESTAMP   NOT NULL,

    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE TABLE user_permissions (
    user_id UUID NOT NULL,
    permissions VARCHAR(50) NOT NULL,

    CONSTRAINT fk_user_permissions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================
-- LISTINGS
-- ============================================================
CREATE TABLE listings (
    id                  UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id           UUID            NOT NULL,
    title               VARCHAR(255)    NOT NULL,
    description         TEXT,
    price               NUMERIC(19, 2)  NOT NULL,
    conservation_state  VARCHAR(50)     NOT NULL,
    status              VARCHAR(50)     NOT NULL DEFAULT 'ACTIVE',
    category            VARCHAR(255),
    location            VARCHAR(255),
    created_at          TIMESTAMP       NOT NULL,

    CONSTRAINT fk_listings_seller FOREIGN KEY (seller_id) REFERENCES users (id)
);

CREATE INDEX idx_listings_seller_id ON listings (seller_id);
CREATE INDEX idx_listings_status    ON listings (status);
CREATE INDEX idx_listings_category  ON listings (category);

-- ============================================================
-- LISTING_IMAGES (ElementCollection)
-- ============================================================
CREATE TABLE listing_images (
    listing_id  UUID            NOT NULL,
    image_url   VARCHAR(512)    NOT NULL,

    CONSTRAINT fk_listing_images_listing FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE INDEX idx_listing_images_listing_id ON listing_images (listing_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
    id               UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id         UUID            NOT NULL,
    status           VARCHAR(50)     NOT NULL DEFAULT 'PENDING',
    payment_method   VARCHAR(50),
    total            NUMERIC(19, 2)  NOT NULL,
    shipping_address VARCHAR(512),
    created_at       TIMESTAMP       NOT NULL,

    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users (id)
);

CREATE INDEX idx_orders_buyer_id ON orders (buyer_id);
CREATE INDEX idx_orders_status   ON orders (status);

-- ============================================================
-- ORDER_ITEMS
-- ============================================================
CREATE TABLE order_items (
    id                  UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id            UUID            NOT NULL,
    listing_id          UUID            NOT NULL,
    price_at_purchase   NUMERIC(19, 2)  NOT NULL,

    CONSTRAINT fk_order_items_order   FOREIGN KEY (order_id)   REFERENCES orders   (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_listing FOREIGN KEY (listing_id) REFERENCES listings  (id)
);

CREATE INDEX idx_order_items_order_id   ON order_items (order_id);
CREATE INDEX idx_order_items_listing_id ON order_items (listing_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id    UUID        NOT NULL,
    seller_id   UUID        NOT NULL,
    listing_id  UUID        NOT NULL,
    created_at  TIMESTAMP   NOT NULL,

    CONSTRAINT fk_conversations_buyer   FOREIGN KEY (buyer_id)   REFERENCES users    (id),
    CONSTRAINT fk_conversations_seller  FOREIGN KEY (seller_id)  REFERENCES users    (id),
    CONSTRAINT fk_conversations_listing FOREIGN KEY (listing_id) REFERENCES listings (id)
);

CREATE INDEX idx_conversations_buyer_id   ON conversations (buyer_id);
CREATE INDEX idx_conversations_seller_id  ON conversations (seller_id);
CREATE INDEX idx_conversations_listing_id ON conversations (listing_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
    id               UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id  UUID        NOT NULL,
    sender_id        UUID        NOT NULL,
    content          TEXT        NOT NULL,
    sent_at          TIMESTAMP   NOT NULL,

    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender       FOREIGN KEY (sender_id)       REFERENCES users          (id)
);

CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX idx_messages_sender_id       ON messages (sender_id);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id  UUID        NOT NULL,
    reviewed_id  UUID        NOT NULL,
    order_id     UUID        NOT NULL,
    rating       INTEGER     NOT NULL,
    comment      TEXT,
    created_at   TIMESTAMP   NOT NULL,

    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users  (id),
    CONSTRAINT fk_reviews_reviewed FOREIGN KEY (reviewed_id) REFERENCES users  (id),
    CONSTRAINT fk_reviews_order    FOREIGN KEY (order_id)    REFERENCES orders (id),
    CONSTRAINT uq_reviews_order    UNIQUE (order_id),
    CONSTRAINT ck_reviews_rating   CHECK  (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_reviews_reviewer_id ON reviews (reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews (reviewed_id);
