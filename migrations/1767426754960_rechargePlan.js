/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable(
    'recharge_plans',
    {
      id: {
        type: 'serial',
        primaryKey: true,
      },

      plan_name: {
        type: 'varchar(100)',
        notNull: true,
      },

      description: {
        type: 'text',
      },

      
      plan_type: {
        type: 'text[]',
        notNull: true,
        default: pgm.literal(
          `ARRAY['ONE-WAY','ROUND-TRIP','OUT-STATION','SCHEDULE']`
        ),
      },

      ride_limit: {
        type: 'int',
        notNull: true,
      },

      validity_days: {
        type: 'int',
        notNull: true,
      },

      price: {
        type: 'numeric(10,2)',
        notNull: true,
      },

      is_active: {
        type: 'boolean',
        notNull: true,
        default: true,
      },

      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('CURRENT_TIMESTAMP'),
      },
    },
    { ifNotExists: true }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable('recharge_plans', { ifExists: true });
};
