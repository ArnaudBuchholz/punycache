/** @type {import('jest').Config} */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'punycache.js'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
