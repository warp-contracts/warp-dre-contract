module.exports = {
  clearMocks: true,

  moduleFileExtensions: ['ts', 'js'],

  testPathIgnorePatterns: ['/.yalc/', '/data/', '/_helpers'],

  testEnvironment: 'node',

  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
};
