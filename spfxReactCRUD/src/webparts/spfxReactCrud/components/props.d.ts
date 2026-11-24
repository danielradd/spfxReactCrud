import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type IProps = {
  context: WebPartContext;
  listName: string;
  theme: IReadonlyTheme | undefined;
};
