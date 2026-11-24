import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SpfxReactCrudWebPartStrings';
import { App } from './App';
import { IProps } from './components/props';

export interface ISpfxReactCrudWebPartProps {
  listName: string;
}

export default class SpfxReactCrudWebPart extends BaseClientSideWebPart<ISpfxReactCrudWebPartProps> {

  private _root: Root | undefined;
  private _theme: IReadonlyTheme | undefined;

  public render(): void {
    const element: React.ReactElement<IProps> = React.createElement(
      App,
      {
        context: this.context,
        listName: this.properties.listName || 'Sample',
        theme: this._theme
      }
    );

    if (!this._root) {
      this._root = createRoot(this.domElement);
    }

    this._root.render(element);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    this._theme = currentTheme;

    const semanticColors = currentTheme?.semanticColors;
    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
    }

    if (this.renderedOnce) {
      this.render();
    }
  }

  // Only reload the list after the author finishes typing the list name.
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected onDispose(): void {
    this._root?.unmount();
    this._root = undefined;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel,
                  description: strings.ListNameFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
