import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { normalizeToKebabOrSnakeCase } from '../../utils/formatting.js';
import { Location, NameParser } from '../../utils/name.parser.js';
import { mergeSourceRoot } from '../../utils/source-root.helpers.js';
import { DecoratorOptions } from './decorator.schema.js';

export function main(options: DecoratorOptions): Rule {
  options = transform(options);
  return chain([mergeSourceRoot(options), mergeWith(generate(options))]);
}

function transform(options: DecoratorOptions): DecoratorOptions {
  const target: DecoratorOptions = Object.assign({}, options);
  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse(target);
  target.name = normalizeToKebabOrSnakeCase(location.name);
  target.path = normalizeToKebabOrSnakeCase(location.path);

  target.path = target.flat
    ? target.path
    : join(target.path as Path, target.name);
  return target;
}

function generate(options: DecoratorOptions): Source {
  return (context: SchematicContext) =>
    apply(url('./files/ts' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
