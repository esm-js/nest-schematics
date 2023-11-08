import { Path, strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  Rule,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { ConfigurationOptions } from './configuration.schema.js';

export function main(options: ConfigurationOptions): Rule {
  return mergeWith(generate(transform(options)));
}

function transform(options: ConfigurationOptions): ConfigurationOptions {
  const target: ConfigurationOptions = Object.assign({}, options);
  target.collection =
    target.collection !== undefined ? target.collection : '@nestjs/schematics';
  return target;
}

function generate(options: ConfigurationOptions): Source {
  const projectOrPath = options.project ?? '.';
  return apply(url('./files/ts' as Path), [
    template({
      ...strings,
      ...options,
    }),
    move(projectOrPath),
  ]);
}
