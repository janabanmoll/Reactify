module.exports = {
  testEnvironment:"jsdom",
  transform:{
    "^.+\\.(js|jsx)$":"@swc/jest"
  },
  setupFilesAfterEnv:["<rootDir>/src/setupTests.js"],
  moduleNameMapper:{
    "\\.(css|less|scss|sass)$":"<rootDir>/src/__mocks__/styleMock.js"
  }
};