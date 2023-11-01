/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.paths.json";
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  moduleDirectories: ["node_modules"],
  modulePaths: [compilerOptions.baseUrl],
};

export default config;
