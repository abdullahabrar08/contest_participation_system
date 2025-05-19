exports.up = (pgm) => {
  // Create roles table
  pgm.createTable("roles", {
    role_id: {
      type: "serial",
      primaryKey: true,
    },
    role_name: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Seed roles
  pgm.sql(`
    INSERT INTO roles (role_id, role_name)
    VALUES 
      (1, 'Admin'),
      (2, 'VIP'),
      (3, 'Normal')
    ON CONFLICT DO NOTHING;
  `);

  // Create users table
  pgm.createTable("users", {
    user_id: {
      type: "serial",
      primaryKey: true,
    },
    username: {
      type: "varchar(100)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    password_hash: {
      type: "varchar(255)",
      notNull: true,
    },
    role_id: {
      type: "integer",
      references: '"roles"',
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    last_login: {
      type: "timestamptz",
    },
  });

  // Create contests table
  pgm.createTable("contests", {
    contest_id: {
      type: "serial",
      primaryKey: true,
    },
    contest_name: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    start_time: {
      type: "timestamptz",
      notNull: true,
    },
    end_time: {
      type: "timestamptz",
      notNull: true,
    },
    is_vip_only: {
      type: "boolean",
      default: false,
    },
    max_score: {
      type: "integer",
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Add CHECK constraint for contests table
  pgm.addConstraint("contests", "check_end_time_after_start_time", {
    check: "end_time > start_time",
  });

  // Create prizes table
  pgm.createTable("prizes", {
    prize_id: {
      type: "serial",
      primaryKey: true,
    },
    contest_id: {
      type: "integer",
      references: "contests(contest_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    prize_name: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create user_prizes table
  pgm.createTable("user_prizes", {
    user_prize_id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
      references: "users(user_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    prize_id: {
      type: "integer",
      references: "prizes(prize_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    contest_id: {
      type: "integer",
      references: "contests(contest_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    awarded_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create leaderboard table
  pgm.createTable("leaderboard", {
    leaderboard_id: {
      type: "serial",
      primaryKey: true,
    },
    contest_id: {
      type: "integer",
      references: "contests(contest_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    user_id: {
      type: "integer",
      references: "users(user_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    score: {
      type: "integer",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create question_types table
  pgm.createTable("question_types", {
    question_type_id: {
      type: "serial",
      primaryKey: true,
    },
    type_name: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },
    description: {
      type: "text",
    },
  });

  // Seed question_types
  pgm.sql(`
    INSERT INTO question_types (type_name, description) VALUES
    ('single_select', 'Multiple choice with one correct answer'),
    ('multi_select', 'Multiple choice with multiple correct answers'),
    ('true_false', 'True or false question');
  `);

  // Create questions table
  pgm.createTable("questions", {
    question_id: {
      type: "serial",
      primaryKey: true,
    },
    contest_id: {
      type: "integer",
      references: "contests(contest_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    question_text: {
      type: "text",
      notNull: true,
    },
    question_type_id: {
      type: "integer",
      references: "question_types(question_type_id)",
      notNull: true,
    },
    points: {
      type: "integer",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create answers table
  pgm.createTable("answers", {
    answer_id: {
      type: "serial",
      primaryKey: true,
    },
    question_id: {
      type: "integer",
      references: "questions(question_id)",
      onDelete: "CASCADE",
      notNull: true,
    },
    answer_text: {
      type: "text",
      notNull: true,
    },
    is_correct: {
      type: "boolean",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create user_contests table
  pgm.createTable("user_contests", {
    user_contest_id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(user_id)",
      onDelete: "CASCADE",
    },
    contest_id: {
      type: "integer",
      notNull: true,
      references: "contests(contest_id)",
      onDelete: "CASCADE",
    },
    participation_time: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    is_submitted: {
      type: "boolean",
      default: false,
    },
  });

  // Add unique constraint for user_id and contest_id
  pgm.addConstraint("user_contests", "unique_user_contest", {
    unique: ["user_id", "contest_id"],
  });

  // Create user_submissions table
  pgm.createTable("user_submissions", {
    user_submission_id: {
      type: "serial",
      primaryKey: true,
    },
    user_contest_id: {
      type: "integer",
      notNull: true,
      references: "user_contests(user_contest_id)",
      onDelete: "CASCADE",
    },
    question_id: {
      type: "integer",
      notNull: true,
      references: "questions(question_id)",
      onDelete: "CASCADE",
    },
    answer_id: {
      type: "integer",
      notNull: true,
      references: "answers(answer_id)",
      onDelete: "CASCADE",
    },
    created_at: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
};

exports.down = (pgm) => {
  // Delete users and roles tables
  pgm.dropTable("users");
  pgm.dropTable("roles");
};
