export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    temporaryPassword: { type: 'string' },
    nickname: { type: 'string' },
  },
  required: ['name', 'email', 'temporaryPassword', 'nickname']
} as const;
