CREATE TABLE IF NOT EXISTS lesson_progress (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    lesson_id BIGINT NOT NULL
        REFERENCES lessons(id)
        ON DELETE CASCADE,

    completed_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id
    ON lesson_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id
    ON lesson_progress(lesson_id);