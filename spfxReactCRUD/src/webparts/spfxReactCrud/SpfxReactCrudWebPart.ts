import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxReactCrudWebPartStrings';
import SpfxReactCrud from './components/SpfxReactCrud';
import { ISpfxReactCrudProps } from './components/ISpfxReactCrudProps';

export interface ISpfxReactCrudWebPartProps {
  description: string;
}

export default class SpfxReactCrudWebPart extends BaseClientSideWebPart<ISpfxReactCrudWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISpfxReactCrudProps> = React.createElement(
      SpfxReactCrud,
      {
        listName: "Projects",
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
