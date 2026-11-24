import * as React from 'react';
import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import * as strings from 'SpfxReactCrudWebPartStrings';
import type { IListItem } from '../../../../services/list.service';
import { format } from '../../../../utils/format';

interface IDeleteDialogProps {
  /** Item to delete. The dialog is shown while it is set. */
  item: IListItem | undefined;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteDialog({ item, onConfirm, onDismiss }: IDeleteDialogProps): React.ReactElement {
  return (
    <Dialog
      hidden={!item}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: strings.DeleteDialogTitle,
        subText: item ? format(strings.DeleteDialogText, item.Title, item.Id) : ''
      }}
      modalProps={{ isBlocking: true }}
    >
      <DialogFooter>
        <PrimaryButton text={strings.ButtonDelete} onClick={onConfirm} />
        <DefaultButton text={strings.ButtonCancel} onClick={onDismiss} />
      </DialogFooter>
    </Dialog>
  );
}
