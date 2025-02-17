import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { FilterOptions } from './filter.schema.js';

describe('Filter Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );

  it('should manage name only', async () => {
    const options: FilterOptions = {
      name: 'foo',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/foo.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/foo.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it('should manage name has a path', async () => {
    const options: FilterOptions = {
      name: 'bar/foo',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/bar/foo.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar/foo.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it('should manage name and path', async () => {
    const options: FilterOptions = {
      name: 'foo',
      path: 'baz',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/baz/foo.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/baz/foo.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it('should manage name to normalize', async () => {
    const options: FilterOptions = {
      name: 'fooBar',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/foo-bar.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/foo-bar.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooBarFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it("should keep underscores file's on path only", async () => {
    const options: FilterOptions = {
      name: '_foo',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/_foo.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/_foo.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it('should manage path to normalize', async () => {
    const options: FilterOptions = {
      name: 'barBaz/foo',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(
      files.find((filename) => filename === '/bar-baz/foo.filter.ts'),
    ).toBeDefined();
    expect(tree.readContent('/bar-baz/foo.filter.ts')).toEqual(
      "import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';\n" +
        '\n' +
        '@Catch()\n' +
        'export class FooFilter<T> implements ExceptionFilter {\n' +
        '  catch(exception: T, host: ArgumentsHost) {}\n' +
        '}\n',
    );
  });

  it('should create a spec file', async () => {
    const options: FilterOptions = {
      name: 'foo',
      spec: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;

    expect(
      files.find((filename) => filename === '/foo.filter.spec.ts'),
    ).not.toBeUndefined();
  });
  it('should create a spec file with custom file suffix', async () => {
    const options: FilterOptions = {
      name: 'foo',
      spec: true,
      specFileSuffix: 'test',
      flat: true,
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('filter', options)
      .toPromise();
    const files: string[] = tree.files;

    expect(
      files.find((filename) => filename === '/foo.filter.spec.ts'),
    ).toBeUndefined();
    expect(
      files.find((filename) => filename === '/foo.filter.test.ts'),
    ).toBeDefined();
  });
});
