const User = {
  gender: {
    MALE: 'male',
    FEMALE: 'female',
  },
};

const Role = {
  roles: {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
  },
};

const Permissions = {
  users: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  departments: {
    READ: 'departments:read',
    CREATE: 'departments:create',
    UPDATE: 'departments:update',
    DELETE: 'departments:delete',
  },
  settings: {
    READ: 'settings:read',
    CREATE: 'settings:create',
    UPDATE: 'settings:update',
    DELETE: 'settings:delete',
  },
  documents: {
    READ: 'documents:read',
    CREATE: 'documents:create',
    UPDATE: 'documents:update',
    DELETE: 'documents:delete',
  },
  sessions: {
    READ: 'sessions:read',
    CREATE: 'sessions:create',
    UPDATE: 'sessions:update',
    DELETE: 'sessions:delete',
  },
  reports: {
    READ: 'reports:read',
    CREATE: 'reports:create',
    UPDATE: 'reports:update',
    DELETE: 'reports:delete',
  },
};

export default {
  User,
  Role,
  Permissions,
};
