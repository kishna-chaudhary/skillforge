-- ============================================================
-- SKILLFORGE
-- Migration 001: Core Schema
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'employee'
        CHECK (role IN ('employee', 'admin')),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- CAREER ROLES
-- ============================================================

CREATE TABLE IF NOT EXISTS career_roles (
    id BIGSERIAL PRIMARY KEY,

    slug VARCHAR(100) NOT NULL UNIQUE,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TOPICS
-- ============================================================

CREATE TABLE IF NOT EXISTS topics (
    id BIGSERIAL PRIMARY KEY,

    career_role_id BIGINT NOT NULL,

    slug VARCHAR(120) NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    duration VARCHAR(50),

    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_topics_career_role
        FOREIGN KEY (career_role_id)
        REFERENCES career_roles(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_topic_slug_per_role
        UNIQUE (career_role_id, slug)
);

-- ============================================================
-- LESSONS
-- ============================================================

CREATE TABLE IF NOT EXISTS lessons (
    id BIGSERIAL PRIMARY KEY,

    topic_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    content TEXT,

    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),

    estimated_minutes INTEGER
        CHECK (
            estimated_minutes IS NULL
            OR estimated_minutes >= 0
        ),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_lesson_position_per_topic
        UNIQUE (topic_id, position)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_topics_career_role_id
    ON topics(career_role_id);

CREATE INDEX IF NOT EXISTS idx_lessons_topic_id
    ON lessons(topic_id);

CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role);