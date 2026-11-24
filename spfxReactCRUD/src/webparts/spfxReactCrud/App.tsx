import * as React from 'react';
import { SpfxReactCrud } from './components';
import type { IProps } from './components/props';

export function App(props: IProps): React.ReactElement {
  return <SpfxReactCrud {...props} />;
}
