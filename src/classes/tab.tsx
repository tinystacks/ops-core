import { Tab as TabType } from '@tinystacks/ops-model';
import { Widget } from './widget';
import React from 'react';

export class Tab extends Widget implements TabType {
  tabDisplayName: string;
  widgetIds: string[];

  constructor (
    id: string,
    displayName: string,
    type: string,
    tabDisplayName: string,
    widgetIds: string[] = [],
    showDisplayName?: boolean,
    description?: string,
    showDescription?: boolean
  ) {
    super(
      id,
      displayName,
      type,
      '',
      showDisplayName,
      description,
      showDescription
    );
    this.tabDisplayName = tabDisplayName;
    this.widgetIds = widgetIds;
  }

  static fromJson (object: TabType): Tab {
    const {
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription
    } = object;
    return new Tab(
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription
    );
  }

  toJson (): TabType {
    const {
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription,
      providerId
    } = this;
    return {
      id,
      displayName,
      type,
      tabDisplayName,
      widgetIds,
      showDisplayName,
      description,
      showDescription,
      providerId
    };
  }

  getData (): void { return; }

  render (): JSX.Element { return <>TODO</>; }
}