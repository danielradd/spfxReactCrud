# spfx-react-crud

Web part do SharePoint Framework que cria, lê, atualiza e exclui itens de uma lista do SharePoint usando React, Fluent UI v8 e `SPHttpClient` (REST).

![version](https://img.shields.io/badge/SPFx-1.24.2-green.svg) ![node](https://img.shields.io/badge/Node-22_LTS-green.svg)

## O que faz

- Mostra os itens da lista (ID e Título) num `DetailsList`, os mais recentes primeiro
- **Criar:** digite um título e clique em *Adicionar*
- **Editar:** selecione um item, altere o título e clique em *Salvar*
- **Excluir:** selecione um item e clique em *Excluir* (pede confirmação; o item vai para a lixeira)
- Mostra mensagens claras quando a lista não existe ou o usuário não tem permissão
- Segue o tema do site (inclusive seções com fundo escuro) e tem textos em pt-br e en-us

## Lista esperada

Qualquer lista do site que tenha a coluna padrão **Título** (`Title`). Não é preciso criar outras colunas.

O nome da lista é configurado no painel de propriedades do web part (*Nome da lista*). O padrão é **`Sample`**.

## Pré-requisitos

- Node.js **22 LTS** (`>=22.14`). Com nvm: `nvm use` (o projeto tem `.nvmrc`)
- Permissão de edição na lista e de edição de página no site
- Para publicar: acesso ao App Catalog do tenant

A toolchain é **Heft** (SPFx 1.22+). Não precisa de gulp nem de pacotes globais.

## Desenvolvimento

```bash
nvm use
npm install
npm start          # heft start --clean, serve em https://localhost:4321
```

O `npm start` abre a página definida em `config/serve.json` já com os parâmetros de debug. Para abrir à mão, use:

```
https://draddx.sharepoint.com/sites/SitedeComunicacao/SitePages/Home.aspx?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js
```

Aceite "Carregar scripts de depuração", edite a página e adicione o web part **SPFx React CRUD**.

> Na primeira vez, o navegador pode recusar o certificado de `localhost:4321`. Abra `https://localhost:4321/temp/build/manifests.js` e aceite o certificado.

## Build e deploy

```bash
npm run build      # build de produção + pacote
```

Gera `sharepoint/solution/spfx-react-crud.sppkg`. Suba esse arquivo no App Catalog do tenant e, no site, adicione o app (ou atualize, se a versão anterior já estiver instalada; o ID da solução é o mesmo).

## Estrutura

```
src/webparts/spfxReactCrud/
├── SpfxReactCrudWebPart.ts        # web part: propriedades, tema, render
├── components/SpfxReactCrud.tsx   # UI (function component + Fluent UI)
├── services/ListService.ts        # chamadas REST à lista
├── models/IListItem.ts
└── loc/                           # textos en-us e pt-br
```

## Histórico

| Versão  | Data       | Comentário |
| ------- | ---------- | ---------- |
| 2.0.0.0 | 23/11/2026 | Upgrade SPFx 1.7.1 → 1.24.2 (Node 22, Heft, React 18), lista configurável, UI com Fluent UI |
| 1.0.0.0 | 2019       | Versão inicial (SPFx 1.7.1) |
