/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Widget } from './Widget';

export type Tab = (Widget & {
  /**
   * A human readable, non-unique name to be displayed
   */
  tabDisplayName?: string;
  /**
   * A list of widgets to display
   */
  widgets?: Array<Widget>;
});

