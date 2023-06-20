import { join, normalize, Path, strings } from '@angular-devkit/core';
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  Source,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { parse } from 'jsonc-parser';
import { normalizeToKebabOrSnakeCase } from '../../utils/formatting.js';
import {
  DEFAULT_LIB_PATH,
  DEFAULT_PATH_NAME,
  PROJECT_TYPE,
} from '../defaults.js';
import { LibraryOptions } from './library.schema.js';

type UpdateJsonFn<T> = (obj: T) => T | void;

export function main(options: LibraryOptions): Rule {
  options = transform(options);
  return chain([
    addLibraryToCliOptions(options.path, options.name),
    updatePackageJson(options),
    branchAndMerge(mergeWith(generate(options))),
  ]);
}

function transform(options: LibraryOptions): LibraryOptions {
  const target: LibraryOptions = Object.assign({}, options);
  const defaultSourceRoot =
    options.rootDir !== undefined ? options.rootDir : DEFAULT_LIB_PATH;

  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  target.name = normalizeToKebabOrSnakeCase(target.name);
  target.path =
    target.path !== undefined
      ? join(normalize(defaultSourceRoot), target.path)
      : normalize(defaultSourceRoot);

  return target;
}

function updatePackageJson(options: LibraryOptions) {
  return (host: Tree) => {
    if (!host.exists('package.json')) {
      return host;
    }

    return updateJsonFile(
      host,
      'package.json',
      (packageJson: Record<string, any>) => {
        updateNpmScripts(packageJson.scripts, options);
        updateJestConfig(packageJson.jest, options);
      },
    );
  };
}

function updateJestConfig(
  jestOptions: Record<string, any>,
  options: LibraryOptions,
) {
  if (!jestOptions) {
    return;
  }
  if (jestOptions.rootDir === DEFAULT_PATH_NAME) {
    jestOptions.rootDir = '.';
    jestOptions.coverageDirectory = './coverage';
  }
  const defaultSourceRoot =
    options.rootDir !== undefined ? options.rootDir : DEFAULT_LIB_PATH;

  const jestSourceRoot = `<rootDir>/${defaultSourceRoot}/`;
  if (!jestOptions.roots) {
    jestOptions.roots = ['<rootDir>/src/', jestSourceRoot];
  } else if (jestOptions.roots.indexOf(jestSourceRoot) < 0) {
    jestOptions.roots.push(jestSourceRoot);
  }
}

function updateNpmScripts(
  scripts: Record<string, any>,
  options: LibraryOptions,
) {
  if (!scripts) {
    return;
  }
  const defaultFormatScriptName = 'format';
  if (!scripts[defaultFormatScriptName]) {
    return;
  }

  if (
    scripts[defaultFormatScriptName] &&
    scripts[defaultFormatScriptName].indexOf(DEFAULT_PATH_NAME) >= 0
  ) {
    const defaultSourceRoot =
      options.rootDir !== undefined ? options.rootDir : DEFAULT_LIB_PATH;
    scripts[
      defaultFormatScriptName
    ] = `prettier --write "src/**/*.ts" "test/**/*.ts" "${defaultSourceRoot}/**/*.ts"`;
  }
}

function updateJsonFile<T>(
  host: Tree,
  path: string,
  callback: UpdateJsonFn<T>,
): Tree {
  const source = host.read(path);
  if (source) {
    const sourceText = source.toString('utf-8');
    const json = parse(sourceText);
    callback(json as unknown as T);
    host.overwrite(path, JSON.stringify(json, null, 2));
  }
  return host;
}

function addLibraryToCliOptions(
  projectRoot: string,
  projectName: string,
): Rule {
  const rootPath = join(projectRoot as Path, projectName);
  const project = {
    type: PROJECT_TYPE.LIBRARY,
    root: rootPath,
    entryFile: 'index',
    sourceRoot: join(rootPath, 'src'),
    compilerOptions: {
      tsConfigPath: join(rootPath, 'tsconfig.lib.json'),
    },
  };
  return (host: Tree) => {
    const nestFileExists = host.exists('nest.json');

    let nestCliFileExists = host.exists('nest-cli.json');
    if (!nestCliFileExists && !nestFileExists) {
      host.create('nest-cli.json', '{}');
      nestCliFileExists = true;
    }
    return updateJsonFile(
      host,
      nestCliFileExists ? 'nest-cli.json' : 'nest.json',
      (optionsFile: Record<string, any>) => {
        if (!optionsFile.projects) {
          optionsFile.projects = {} as any;
        }
        if (optionsFile.projects[projectName]) {
          throw new SchematicsException(
            `Project "${projectName}" exists in this workspace already.`,
          );
        }
        optionsFile.projects[projectName] = project;
      },
    );
  };
}

function generate(options: LibraryOptions): Source {
  const path = join(options.path as Path, options.name);

  return apply(url('./files/ts' as Path), [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ]);
}
