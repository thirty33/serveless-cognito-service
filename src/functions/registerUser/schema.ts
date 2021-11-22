export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'string' },
    temporaryPassword: { type: 'string' },
    nickname: { type: 'string' },
  },
  required: ['name', 'username', 'email', 'temporaryPassword', 'nickname']
} as const;
