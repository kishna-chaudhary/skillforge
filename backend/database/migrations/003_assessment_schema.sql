-- ============================================================
-- SkillForge assessment schema
-- ============================================================

BEGIN;

-- ============================================================
-- ASSESSMENTS
-- One topic can have one assessment.
-- ============================================================

CREATE TABLE IF NOT EXISTS assessments (
    id BIGSERIAL PRIMARY KEY,

    topic_id BIGINT NOT NULL
        REFERENCES topics(id)
        ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    passing_score INTEGER NOT NULL DEFAULT 70,

    duration_minutes INTEGER NOT NULL DEFAULT 10,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessments_topic_unique
        UNIQUE (topic_id),

    CONSTRAINT assessments_passing_score_check
        CHECK (
            passing_score >= 0
            AND passing_score <= 100
        ),

    CONSTRAINT assessments_duration_check
        CHECK (duration_minutes > 0)
);

-- ============================================================
-- ASSESSMENT QUESTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_questions (
    id BIGSERIAL PRIMARY KEY,

    assessment_id BIGINT NOT NULL
        REFERENCES assessments(id)
        ON DELETE CASCADE,

    question TEXT NOT NULL,

    position INTEGER NOT NULL DEFAULT 0,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessment_questions_position_check
        CHECK (position >= 0),

    CONSTRAINT assessment_questions_position_unique
        UNIQUE (assessment_id, position)
);

-- ============================================================
-- QUESTION OPTIONS
--
-- is_correct remains SERVER-SIDE.
-- The public quiz API must never expose it.
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_options (
    id BIGSERIAL PRIMARY KEY,

    question_id BIGINT NOT NULL
        REFERENCES assessment_questions(id)
        ON DELETE CASCADE,

    option_text TEXT NOT NULL,

    is_correct BOOLEAN NOT NULL DEFAULT FALSE,

    position INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessment_options_position_check
        CHECK (position >= 0),

    CONSTRAINT assessment_options_position_unique
        UNIQUE (question_id, position)
);

-- ============================================================
-- ASSESSMENT ATTEMPTS
--
-- Stores the employee's submitted assessment result.
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    assessment_id BIGINT NOT NULL
        REFERENCES assessments(id)
        ON DELETE CASCADE,

    score INTEGER NOT NULL,

    correct_answers INTEGER NOT NULL,

    total_questions INTEGER NOT NULL,

    passed BOOLEAN NOT NULL,

    integrity_event_count INTEGER NOT NULL DEFAULT 0,

    started_at TIMESTAMPTZ,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessment_attempt_score_check
        CHECK (
            score >= 0
            AND score <= 100
        ),

    CONSTRAINT assessment_attempt_correct_check
        CHECK (correct_answers >= 0),

    CONSTRAINT assessment_attempt_total_check
        CHECK (total_questions >= 0),

    CONSTRAINT assessment_attempt_integrity_check
        CHECK (integrity_event_count >= 0)
);

-- ============================================================
-- ANSWERS SUBMITTED DURING AN ATTEMPT
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_attempt_answers (
    id BIGSERIAL PRIMARY KEY,

    attempt_id BIGINT NOT NULL
        REFERENCES assessment_attempts(id)
        ON DELETE CASCADE,

    question_id BIGINT NOT NULL
        REFERENCES assessment_questions(id)
        ON DELETE CASCADE,

    selected_option_id BIGINT
        REFERENCES assessment_options(id)
        ON DELETE SET NULL,

    is_correct BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT assessment_attempt_answer_unique
        UNIQUE (attempt_id, question_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
    idx_assessments_topic_id
ON assessments(topic_id);

CREATE INDEX IF NOT EXISTS
    idx_assessment_questions_assessment_id
ON assessment_questions(assessment_id);

CREATE INDEX IF NOT EXISTS
    idx_assessment_options_question_id
ON assessment_options(question_id);

CREATE INDEX IF NOT EXISTS
    idx_assessment_attempts_user_id
ON assessment_attempts(user_id);

CREATE INDEX IF NOT EXISTS
    idx_assessment_attempts_assessment_id
ON assessment_attempts(assessment_id);

CREATE INDEX IF NOT EXISTS
    idx_assessment_attempt_answers_attempt_id
ON assessment_attempt_answers(attempt_id);

COMMIT;