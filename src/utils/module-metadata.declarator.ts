import { MetadataManager } from './metadata.manager.js';
import { DeclarationOptions } from './module.declarator.js';

export class ModuleMetadataDeclarator {
  public declare(content: string, options: DeclarationOptions): string {
    const manager = new MetadataManager(content);
    const inserted = manager.insert(
      options.metadata,
      options.symbol,
      options.staticOptions,
    );
    return inserted ?? content;
  }
}
