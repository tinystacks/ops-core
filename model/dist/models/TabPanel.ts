/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tab } from './Tab';
import type { Widget } from './Widget';

export type TabPanel = (Widget & {
  /**
   * A list of tab widgets to be displayed
   */
  tabs?: Array<Tab>;
});

