/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Widget = {
  /**
   * A unique ID for this widget. Your console is not valid if widgets share an ID
   */
  id?: string;
  /**
   * A human-readable display name, usually used to title a widget
   */
  displayName?: string;
  /**
   * Whether to show the display name
   */
  showDisplayName?: boolean;
  description?: string;
  showDescription?: string;
  /**
   * This describes how this widget should be rendered. The "type" should be equivalent to the Object definition's name of the widget you are trying to render.
   */
  type?: string;
};

