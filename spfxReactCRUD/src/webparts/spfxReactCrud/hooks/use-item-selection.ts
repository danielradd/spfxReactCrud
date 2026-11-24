import * as React from 'react';
import { Selection } from '@fluentui/react';
import type { IListItem } from '../../../services/list.service';

export interface IItemSelection {
  /** Fluent UI selection to give to the DetailsList. */
  selection: Selection;
  selected: IListItem | undefined;
  clear: () => void;
}

/** Single selection of a list item in the table. */
export function useItemSelection(): IItemSelection {
  const [selected, setSelected] = React.useState<IListItem | undefined>(undefined);

  const selection: Selection = React.useMemo(() => {
    const instance: Selection = new Selection({
      onSelectionChanged: () => {
        setSelected(instance.getSelection()[0] as IListItem | undefined);
      }
    });
    return instance;
  }, []);

  const clear = React.useCallback((): void => {
    selection.setAllSelected(false);
  }, [selection]);

  return { selection, selected, clear };
}
