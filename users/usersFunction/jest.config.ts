import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { compilerOptions } from './tsconfig.paths.json';

const config: Config.InitialOptions = {
  clearMocks: true,
  collectCoverage: true,
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.ts'],
};
export default config;
