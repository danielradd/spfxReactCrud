declare interface ISpfxReactCrudWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  ListNameFieldLabel: string;
  ListNameFieldDescription: string;

  Heading: string;
  Loading: string;
  EmptyList: string;
  ColumnId: string;
  ColumnTitle: string;
  TitleFieldNewLabel: string;
  TitleFieldEditLabel: string;
  ButtonCreate: string;
  ButtonSave: string;
  ButtonDelete: string;
  ButtonCancel: string;
  ButtonRefresh: string;
  DeleteDialogTitle: string;
  DeleteDialogText: string;
  StatusCreated: string;
  StatusUpdated: string;
  StatusDeleted: string;
  ErrorListNotFound: string;
  ErrorAccessDenied: string;
  ErrorGeneric: string;
}

declare module 'SpfxReactCrudWebPartStrings' {
  const strings: ISpfxReactCrudWebPartStrings;
  export = strings;
}
