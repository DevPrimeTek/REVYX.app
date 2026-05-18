import { customType } from 'drizzle-orm/pg-core';

// PostgreSQL INET custom type (Drizzle doesn't ship one out-of-the-box for inet)
export const inet = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'inet';
  },
});
