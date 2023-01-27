/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Page } from './Page';

/**
 * A console is a top-level construct that defines all
 */
export type Console = {
  /**
   * a human-readable name for your console.
   */
  name?: string;
  pages?: Array<Page>;
  providers?: Array<any>;
};

