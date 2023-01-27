/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Widget } from './Widget';

export type Page = (Widget & {
  widgets?: Array<Widget>;
  /**
   * A URL-safe route where this page can be accessed
   */
  route?: string;
});

