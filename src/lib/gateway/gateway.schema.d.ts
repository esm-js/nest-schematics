import { Path } from '@angular-devkit/core';

export interface GatewayOptions {
  /**
   * The name of the gateway.
   */
  name: string;
  /**
   * The path to create the gateway.
   */
  path?: string | Path;
  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Specifies the file suffix of spec files.
   * @default "spec"
   */
  specFileSuffix?: string;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  /**
   * Nest element type name
   */
  type?: string;
}
