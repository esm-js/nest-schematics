import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { LibraryOptions } from './library.schema.js';

describe('Library Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should manage name only', async () => {
    const options: LibraryOptions = {
      name: 'project',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('library', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/nest-cli.json',
      '/libs/project/tsconfig.lib.json',
      '/libs/project/src/index.ts',
      '/libs/project/src/project.module.ts',
      '/libs/project/src/project.service.spec.ts',
      '/libs/project/src/project.service.ts',
    ]);
  });
  it('should manage name to normalize', async () => {
    const options: LibraryOptions = {
      name: 'awesomeProject',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('library', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/nest-cli.json',
      '/libs/awesome-project/tsconfig.lib.json',
      '/libs/awesome-project/src/index.ts',
      '/libs/awesome-project/src/awesome-project.module.ts',
      '/libs/awesome-project/src/awesome-project.service.spec.ts',
      '/libs/awesome-project/src/awesome-project.service.ts',
    ]);
  });
  it("should keep underscores in library's path and file name", async () => {
    const options: LibraryOptions = {
      name: '_project',
    };
    const tree: UnitTestTree = await runner
      .runSchematicAsync('library', options)
      .toPromise();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/nest-cli.json',
      '/libs/_project/tsconfig.lib.json',
      '/libs/_project/src/index.ts',
      '/libs/_project/src/_project.module.ts',
      '/libs/_project/src/_project.service.spec.ts',
      '/libs/_project/src/_project.service.ts',
    ]);
  });
});
