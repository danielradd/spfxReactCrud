import type { SPHttpClient } from '@microsoft/sp-http';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface ISpfxReactCrudProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
  theme: IReadonlyTheme | undefined;
}
