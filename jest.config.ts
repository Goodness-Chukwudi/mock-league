export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // setupFiles: ['dotenv/config'],
    globalSetup: "<rootDir>/tests/globalSetup.ts",
    globalTeardown: "<rootDir>/tests/globalTearDown.ts",
    setupFilesAfterEnv: ["<rootDir>/tests/index.ts"],
    // coverageReporters: ['text', 'html'],
    // coverageDirectory: '<rootDir>/coverage/'
};