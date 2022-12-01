module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": true
      }
    ],
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ["js", "ts", "svelte"]
};