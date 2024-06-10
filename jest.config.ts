export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: "<rootDir>/tests/globalSetup.ts",
    globalTeardown: "<rootDir>/tests/globalTearDown.ts",
    setupFilesAfterEnv: ["<rootDir>/tests/index.ts"]
};