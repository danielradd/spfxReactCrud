import * as React from 'react';
import {
  DetailsList,
  DetailsListLayoutMode,
  type IColumn,
  type Selection,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Text
} from '@fluentui/react';
import * as strings from 'SpfxReactCrudWebPartStrings';
import type { IListItem } from '../../../../services/list.service';

interface IItemsTableProps {
  items: IListItem[];
  loading: boolean;
  selection: Selection;
}

const columns: IColumn[] = [
  { key: 'id', name: strings.ColumnId, fieldName: 'Id', minWidth: 40, maxWidth: 70 },
  { key: 'title', name: strings.ColumnTitle, fieldName: 'Title', minWidth: 200, isMultiline: true }
];

export function ItemsTable({ items, loading, selection }: IItemsTableProps): React.ReactElement {
  if (loading) {
    return <Spinner size={SpinnerSize.large} label={strings.Loading} />;
  }

  if (items.length === 0) {
    return <Text>{strings.EmptyList}</Text>;
  }

  return (
    <DetailsList
      items={items}
      columns={columns}
      selection={selection}
      selectionMode={SelectionMode.single}
      selectionPreservedOnEmptyClick
      layoutMode={DetailsListLayoutMode.justified}
      getKey={(item: IListItem) => String(item.Id)}
      setKey="items"
    />
  );
}
