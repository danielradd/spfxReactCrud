import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxReactCrudWebPartStrings';
import SpfxReactCrud from './components/SpfxReactCrud';
import { ISpfxReactCrudProps } from './components/ISpfxReactCrudProps';

export interface ISpfxReactCrudWebPartProps {
  description: string;
}

export default class SpfxReactCrudWebPart extends BaseClientSideWebPart<ISpfxReactCrudWebPartProps> {

  private _root: Root | undefined;

  public render(): void {
    const element: React.ReactElement<ISpfxReactCrudProps> = React.createElement(
      SpfxReactCrud,
      {
        listName: "Projects",
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    if (!this._root) {
      this._root = createRoot(this.domElement);
    }

    this._root.render(element);
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
