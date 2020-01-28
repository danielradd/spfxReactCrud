import { SPHttpClient } from '@microsoft/sp-http'; 
export interface ISpfxReactCrudProps {
  listName: string;  
  spHttpClient: SPHttpClient;  
  siteUrl: string;
}