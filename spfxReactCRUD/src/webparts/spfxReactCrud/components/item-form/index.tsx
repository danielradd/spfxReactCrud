import * as React from 'react';
import { DefaultButton, PrimaryButton, Stack, TextField } from '@fluentui/react';
import * as strings from 'SpfxReactCrudWebPartStrings';
import type { IListItem } from '../../../../services/list.service';
import { format } from '../../../../utils/format';
import styles from './styles.module.scss';

interface IItemFormProps {
  /** Item being edited. Without it the form creates a new item. */
  selected: IListItem | undefined;
  busy: boolean;
  loading: boolean;
  onCreate: (title: string) => Promise<boolean>;
  onUpdate: (id: number, title: string) => Promise<boolean>;
  onDelete: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export function ItemForm({
  selected,
  busy,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
  onRefresh
}: IItemFormProps): React.ReactElement {
  const [title, setTitle] = React.useState<string>('');

  // Selecting an item loads its title; clearing the selection empties the field.
  React.useEffect(() => {
    setTitle(selected ? selected.Title || '' : '');
  }, [selected]);

  const trimmed: string = title.trim();

  async function create(): Promise<void> {
    if (await onCreate(trimmed)) {
      setTitle('');
    }
  }

  async function save(): Promise<void> {
    if (selected) {
      await onUpdate(selected.Id, trimmed);
    }
  }

  return (
    <Stack horizontal wrap verticalAlign="end" tokens={{ childrenGap: 8 }}>
      <Stack.Item grow className={styles.titleField}>
        <TextField
          label={selected ? format(strings.TitleFieldEditLabel, selected.Id) : strings.TitleFieldNewLabel}
          value={title}
          onChange={(_, value) => setTitle(value || '')}
          disabled={busy}
        />
      </Stack.Item>
      {selected ? (
        <>
          <PrimaryButton text={strings.ButtonSave} iconProps={{ iconName: 'Save' }} onClick={save} disabled={busy || !trimmed} />
          <DefaultButton text={strings.ButtonDelete} iconProps={{ iconName: 'Delete' }} onClick={onDelete} disabled={busy} />
          <DefaultButton text={strings.ButtonCancel} onClick={onCancel} disabled={busy} />
        </>
      ) : (
        <PrimaryButton text={strings.ButtonCreate} iconProps={{ iconName: 'Add' }} onClick={create} disabled={busy || !trimmed} />
      )}
      <DefaultButton text={strings.ButtonRefresh} iconProps={{ iconName: 'Refresh' }} onClick={onRefresh} disabled={busy || loading} />
    </Stack>
  );
}
