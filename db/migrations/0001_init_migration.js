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
      type: "timestamp",
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
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    last_login: {
      type: "timestamp",
    },
  });
};

exports.down = (pgm) => {
  // Delete users and roles tables
  pgm.dropTable("users");
  pgm.dropTable("roles");
};
