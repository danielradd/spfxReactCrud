---
name: novo-componente
description: Cria um componente React novo no web part spfxReactCrud seguindo o padrão do projeto (pasta kebab-case, export function, props tipadas, strings em loc/ en-us e pt-br, SCSS com tokens). Use quando pedirem um componente, tela, seção ou peça nova de UI neste projeto.
argument-hint: "<nome-kebab-case> [o que o componente faz]"
---

# Novo componente

Argumentos: `$ARGUMENTS` (o primeiro é o nome em kebab-case; o resto descreve o componente).

## Passos

1. **Pasta:** `spfxReactCRUD/src/webparts/spfxReactCrud/components/<nome>/index.tsx`. Se o componente for usado por mais de um web part, use `spfxReactCRUD/src/components/<nome>/` e exporte em `src/components/index.ts`.
2. **Componente** (modelo: `components/item-form/index.tsx`):
   ```tsx
   import * as React from 'react';
   import * as strings from 'SpfxReactCrudWebPartStrings';

   interface I<Nome>Props {
     // dados e callbacks vindos do pai
   }

   export function <Nome>({ ... }: I<Nome>Props): React.ReactElement {
     return ( ... );
   }
   ```
   - Nome da função em PascalCase a partir do kebab-case (`delete-dialog` → `DeleteDialog`)
   - Nada de service, PnP ou fetch aqui: o dado chega por props
3. **Estilo**, só se precisar: `styles.module.scss` na mesma pasta, com `@use "../../../../styles/variables" as *;`. Valor novo e reaproveitável vira token em `src/styles/_variables.scss`.
4. **Textos:** cada string de tela vai em `loc/en-us.js`, `loc/pt-br.js` e `loc/mystrings.d.ts` (mesma chave nos três).
5. **Ligar na tela:** importar em `components/index.tsx` (`import { <Nome> } from './<nome>'`) e passar dados/callbacks do hook.
6. **Se precisar de dado novo do SharePoint:** use a skill `novo-service` (ou um método novo no service existente) e exponha pelo hook em `hooks/`.
7. **Verificar** com o checklist "Antes de dar uma tarefa por concluída" do `CLAUDE.md`.
