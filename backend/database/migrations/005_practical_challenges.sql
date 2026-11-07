-- ============================================================
-- SkillForge
-- Migration 005
-- Practical Challenges
-- ============================================================


-- ============================================================
-- PRACTICAL CHALLENGES
--
-- One final practical challenge per career role.
-- ============================================================

CREATE TABLE IF NOT EXISTS practical_challenges (
    id BIGSERIAL PRIMARY KEY,

    career_role_id BIGINT NOT NULL
        REFERENCES career_roles(id)
        ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    instructions TEXT NOT NULL,

    starter_code TEXT,

    language VARCHAR(50) NOT NULL,

    visible_tests JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    hidden_tests JSONB NOT NULL
        DEFAULT '[]'::jsonb,

    passing_score INTEGER NOT NULL
        DEFAULT 70,

    duration_minutes INTEGER,

    is_active BOOLEAN NOT NULL
        DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT practical_challenges_role_unique
        UNIQUE (career_role_id),

    CONSTRAINT practical_challenges_passing_score_check
        CHECK (
            passing_score >= 0
            AND passing_score <= 100
        ),

    CONSTRAINT practical_challenges_duration_check
        CHECK (
            duration_minutes IS NULL
            OR duration_minutes > 0
        )
);


-- ============================================================
-- PRACTICAL CHALLENGE ATTEMPTS
--
-- Stores every employee submission.
--
-- IMPORTANT:
-- Actual code execution will later happen through an isolated
-- runner/service. Arbitrary student code must NOT be executed
-- directly inside the Express process.
-- ============================================================

CREATE TABLE IF NOT EXISTS practical_challenge_attempts (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    practical_challenge_id BIGINT NOT NULL
        REFERENCES practical_challenges(id)
        ON DELETE CASCADE,

    submitted_code TEXT NOT NULL,

    score INTEGER,

    passed BOOLEAN NOT NULL
        DEFAULT FALSE,

    execution_status VARCHAR(30) NOT NULL
        DEFAULT 'pending',

    execution_result JSONB,

    started_at TIMESTAMPTZ,

    submitted_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT practical_attempt_score_check
        CHECK (
            score IS NULL
            OR (
                score >= 0
                AND score <= 100
            )
        ),

    CONSTRAINT practical_attempt_status_check
        CHECK (
            execution_status IN (
                'pending',
                'running',
                'completed',
                'failed',
                'timeout'
            )
        )
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS
    idx_practical_challenges_career_role_id
ON practical_challenges(career_role_id);


CREATE INDEX IF NOT EXISTS
    idx_practical_attempts_user_id
ON practical_challenge_attempts(user_id);


CREATE INDEX IF NOT EXISTS
    idx_practical_attempts_challenge_id
ON practical_challenge_attempts(
    practical_challenge_id
);


CREATE INDEX IF NOT EXISTS
    idx_practical_attempts_user_challenge
ON practical_challenge_attempts(
    user_id,
    practical_challenge_id
);


CREATE INDEX IF NOT EXISTS
    idx_practical_attempts_passed
ON practical_challenge_attempts(
    user_id,
    practical_challenge_id,
    passed
);