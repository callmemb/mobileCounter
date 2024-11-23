/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as AboutImport } from './routes/about'
import { Route as R404Import } from './routes/404'
import { Route as IndexImport } from './routes/index'
import { Route as TestIndexImport } from './routes/test/index'
import { Route as GroupsIndexImport } from './routes/groups/index'
import { Route as CountersIndexImport } from './routes/counters/index'
import { Route as GroupsNewImport } from './routes/groups/new'
import { Route as GroupsIdImport } from './routes/groups/$id'
import { Route as CountersNewImport } from './routes/counters/new'
import { Route as CountersIdIndexImport } from './routes/counters/$id/index'
import { Route as CountersIdEditImport } from './routes/counters/$id/edit'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const R404Route = R404Import.update({
  id: '/404',
  path: '/404',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TestIndexRoute = TestIndexImport.update({
  id: '/test/',
  path: '/test/',
  getParentRoute: () => rootRoute,
} as any)

const GroupsIndexRoute = GroupsIndexImport.update({
  id: '/groups/',
  path: '/groups/',
  getParentRoute: () => rootRoute,
} as any)

const CountersIndexRoute = CountersIndexImport.update({
  id: '/counters/',
  path: '/counters/',
  getParentRoute: () => rootRoute,
} as any)

const GroupsNewRoute = GroupsNewImport.update({
  id: '/groups/new',
  path: '/groups/new',
  getParentRoute: () => rootRoute,
} as any)

const GroupsIdRoute = GroupsIdImport.update({
  id: '/groups/$id',
  path: '/groups/$id',
  getParentRoute: () => rootRoute,
} as any)

const CountersNewRoute = CountersNewImport.update({
  id: '/counters/new',
  path: '/counters/new',
  getParentRoute: () => rootRoute,
} as any)

const CountersIdIndexRoute = CountersIdIndexImport.update({
  id: '/counters/$id/',
  path: '/counters/$id/',
  getParentRoute: () => rootRoute,
} as any)

const CountersIdEditRoute = CountersIdEditImport.update({
  id: '/counters/$id/edit',
  path: '/counters/$id/edit',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/404': {
      id: '/404'
      path: '/404'
      fullPath: '/404'
      preLoaderRoute: typeof R404Import
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/counters/new': {
      id: '/counters/new'
      path: '/counters/new'
      fullPath: '/counters/new'
      preLoaderRoute: typeof CountersNewImport
      parentRoute: typeof rootRoute
    }
    '/groups/$id': {
      id: '/groups/$id'
      path: '/groups/$id'
      fullPath: '/groups/$id'
      preLoaderRoute: typeof GroupsIdImport
      parentRoute: typeof rootRoute
    }
    '/groups/new': {
      id: '/groups/new'
      path: '/groups/new'
      fullPath: '/groups/new'
      preLoaderRoute: typeof GroupsNewImport
      parentRoute: typeof rootRoute
    }
    '/counters/': {
      id: '/counters/'
      path: '/counters'
      fullPath: '/counters'
      preLoaderRoute: typeof CountersIndexImport
      parentRoute: typeof rootRoute
    }
    '/groups/': {
      id: '/groups/'
      path: '/groups'
      fullPath: '/groups'
      preLoaderRoute: typeof GroupsIndexImport
      parentRoute: typeof rootRoute
    }
    '/test/': {
      id: '/test/'
      path: '/test'
      fullPath: '/test'
      preLoaderRoute: typeof TestIndexImport
      parentRoute: typeof rootRoute
    }
    '/counters/$id/edit': {
      id: '/counters/$id/edit'
      path: '/counters/$id/edit'
      fullPath: '/counters/$id/edit'
      preLoaderRoute: typeof CountersIdEditImport
      parentRoute: typeof rootRoute
    }
    '/counters/$id/': {
      id: '/counters/$id/'
      path: '/counters/$id'
      fullPath: '/counters/$id'
      preLoaderRoute: typeof CountersIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/counters/new': typeof CountersNewRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/counters': typeof CountersIndexRoute
  '/groups': typeof GroupsIndexRoute
  '/test': typeof TestIndexRoute
  '/counters/$id/edit': typeof CountersIdEditRoute
  '/counters/$id': typeof CountersIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/counters/new': typeof CountersNewRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/counters': typeof CountersIndexRoute
  '/groups': typeof GroupsIndexRoute
  '/test': typeof TestIndexRoute
  '/counters/$id/edit': typeof CountersIdEditRoute
  '/counters/$id': typeof CountersIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/settings': typeof SettingsRoute
  '/counters/new': typeof CountersNewRoute
  '/groups/$id': typeof GroupsIdRoute
  '/groups/new': typeof GroupsNewRoute
  '/counters/': typeof CountersIndexRoute
  '/groups/': typeof GroupsIndexRoute
  '/test/': typeof TestIndexRoute
  '/counters/$id/edit': typeof CountersIdEditRoute
  '/counters/$id/': typeof CountersIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/404'
    | '/about'
    | '/settings'
    | '/counters/new'
    | '/groups/$id'
    | '/groups/new'
    | '/counters'
    | '/groups'
    | '/test'
    | '/counters/$id/edit'
    | '/counters/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/404'
    | '/about'
    | '/settings'
    | '/counters/new'
    | '/groups/$id'
    | '/groups/new'
    | '/counters'
    | '/groups'
    | '/test'
    | '/counters/$id/edit'
    | '/counters/$id'
  id:
    | '__root__'
    | '/'
    | '/404'
    | '/about'
    | '/settings'
    | '/counters/new'
    | '/groups/$id'
    | '/groups/new'
    | '/counters/'
    | '/groups/'
    | '/test/'
    | '/counters/$id/edit'
    | '/counters/$id/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  R404Route: typeof R404Route
  AboutRoute: typeof AboutRoute
  SettingsRoute: typeof SettingsRoute
  CountersNewRoute: typeof CountersNewRoute
  GroupsIdRoute: typeof GroupsIdRoute
  GroupsNewRoute: typeof GroupsNewRoute
  CountersIndexRoute: typeof CountersIndexRoute
  GroupsIndexRoute: typeof GroupsIndexRoute
  TestIndexRoute: typeof TestIndexRoute
  CountersIdEditRoute: typeof CountersIdEditRoute
  CountersIdIndexRoute: typeof CountersIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  R404Route: R404Route,
  AboutRoute: AboutRoute,
  SettingsRoute: SettingsRoute,
  CountersNewRoute: CountersNewRoute,
  GroupsIdRoute: GroupsIdRoute,
  GroupsNewRoute: GroupsNewRoute,
  CountersIndexRoute: CountersIndexRoute,
  GroupsIndexRoute: GroupsIndexRoute,
  TestIndexRoute: TestIndexRoute,
  CountersIdEditRoute: CountersIdEditRoute,
  CountersIdIndexRoute: CountersIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/404",
        "/about",
        "/settings",
        "/counters/new",
        "/groups/$id",
        "/groups/new",
        "/counters/",
        "/groups/",
        "/test/",
        "/counters/$id/edit",
        "/counters/$id/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/404": {
      "filePath": "404.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/counters/new": {
      "filePath": "counters/new.tsx"
    },
    "/groups/$id": {
      "filePath": "groups/$id.tsx"
    },
    "/groups/new": {
      "filePath": "groups/new.tsx"
    },
    "/counters/": {
      "filePath": "counters/index.tsx"
    },
    "/groups/": {
      "filePath": "groups/index.tsx"
    },
    "/test/": {
      "filePath": "test/index.tsx"
    },
    "/counters/$id/edit": {
      "filePath": "counters/$id/edit.tsx"
    },
    "/counters/$id/": {
      "filePath": "counters/$id/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
