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
};

export default {
  User,
  Role,
  Permissions,
};
