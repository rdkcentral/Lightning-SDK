# TypeScript Support

As of version 5.1.0, Lightning SDK comes bundled with type definitions and in-code documentation which allow you to build Lightning apps in [TypeScript](https://www.typescriptlang.org/). The following documentation assumes to an extent that you are already familiar with the basics of writting a Lightning app in JavaScript, but even if you have no experience at all with Lightning, you may find the tips below as well as the Lightning CLI `lng create` boilerplate (coming soon) and the types/documentation available now in your IDE by using TypeScript enough to get started.

Currently, Lightning SDK includes extensive type definitions for the following plugins:
- [Image](plugins/image.md)
- [Router](plugins/router/index.md)
- [Lightning](plugins/lightning.md)
  - Requires Lightning Core version 2.7.0
- [Utils](plugins/utils.md)

All other plugins are stubbed out as the `any` type, so they will still work as they have been without type checking.

If you haven't already, read the [Lightning Core TypeScript Documentation](../lightning-core-reference/TypeScript/index.md) for extensive use guidelines. The rest of this documentation page will focus solely on things you need to know to use the Lightning SDK with TypeScript.

TypeScript compilation is supported out of the box by Lightning CLI as of version [v2.8.0](https://github.com/rdkcentral/Lightning-CLI/blob/master/CHANGELOG.md#v280).

## Requirements

- Minimum TypeScript version: [4.7.3](https://github.com/microsoft/TypeScript/releases/tag/v4.7.3) (as tested)
- Minimum Lightning CLI version: [2.8.0](https://github.com/rdkcentral/Lightning-CLI/blob/master/CHANGELOG.md#v280)
  - If using Lightning CLI.

## Router Pages (IsPage)

A Router Page can be any Lightning Component. But because there are some special properties / features (`widgets`, `params`, `pageTransition`, `historyState`, etc) available on Pages that aren't available on other Components, we need need a mechanism to tell TypeScript that a Component is a Router Page. The Lightning SDK adds a new property that can be configured in a Component's [Type Config](../lightning-core-reference/TypeScript/TypeConfigs.md) called `IsPage`.

```ts
interface MyPageTypeConfig extends Lightning.Component.TypeConfig {
  IsPage: true;
}

class MyPage extends Lightning.Component</*...*/, MyPageTypeConfig> {

  override pageTransition() {
    return 'left';
  }

  override _onUrlParams() {
    // These properties are now available:
    this.params;
    this.widgets; // See CustomWidgets augmentation
    this[Router.symbols.hash];
    this[Router.symbols.route];
  }
}
```

## Augmentation

There are certain global type structures provided by Lightning SDK that your app may need/want to add on to. TypeScript allows such add-ons via [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) and [Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

The following are the TypeScript interfaces exported by Lightning SDK that are designed for augmentation. You may find need to augment other available interfaces. In this event, please let us know what interfaces you are augmenting so we may add use guidelines to this page (or submit a [PR](https://github.com/rdkcentral/Lightning-SDK/pulls)!).

### Router.CustomWidgets

If you use the [Widgets](plugins/router/widgets.md) feature of the Router, you can augment this interface with all of the Widgets defined in your application in order to enable strong type-checking, and IDE assitance when interacting with them.

#### Default Behavior

By default, if this interface is not augmented, Widgets still can be used, however in a much looser typed way.

The `widgets` object that is available on any Router Page (See Router Pages above) will accept any key and the value type will always be unknown. This requires you to explicitly assert the Component type of the widget:
```ts
// This statement's type is `unknown`
this.widgets.anythingwillwork;

// You must explicitly assert in order to access methods/etc from it
(this.widgets.anythingwillwork as MyWidgetComponent).doSomething();
```

The `Router.focusWidget()` method will accept any string:
```ts
Router.focusWidget('AnythingWillWork');
```

It will be the responsibility of the developer to ensure the right casing is used in each situation.

#### Augmented Behavior

If this interface is augmented, only the specifically defined widgets will be allowed in the above situations.

When augmenting this interface, the key name is the PascalCase 'ref' key name of the widget and the value type is the `typeof` the Widget's Component.

Example:
```ts
import '@lightningjs/sdk'

declare module '@lightningjs/sdk' {
  namespace Router {
    interface CustomWidgets {
      Menu: typeof MenuComponent;
      Overlay: typeof OverlayComponent;
    }
  }
}
```

By augmenting the above, you will now have strong type checking and IDE assistance when interacting with Widgets.

The `widgets` object only allows the specific Widget names (properly lower-cased) that were augmented, and their values are typed with the defined Widget Component instance types:
```ts
// TypeScript only allows 'menu' and 'overlay' in their proper lower-case forms
this.widgets.menu;
this.widgets.overlay;

// They are typed as their Component instance types, so you may call methods directly on them
this.widgets.menu.selectItem(0);
this.widgets.overlay.animate(/* ... */);

// Widget names not included in the augmentation will now cause errors
// @ts-expect-error
this.widgets.anythingwillnotwork;
```

The `Router.focusWidgets()` method only allows the specific Widget names (properly PascalCased):
```ts
// TypeScript only allows 'Menu' or 'Overlay' in the proper casing.
Router.focusWidget('Menu');
Router.focusWidget('Overlay');

// @ts-expect-error
Router.focusWidget('AnythingWillNotWork');
```

### Application.AppData

When `Launch()` is called to launch your application, an optional last parameter `appData` may be passed in. At any point later your application may access this data by importing `AppData` from the SDK.

The shape of the object you pass into `Launch()` and the run-time variable you can import is defined by the `Application.AppData` interface. By default, this interface is empty any non-null is allowed.

If you'd like to define this structure explicitly, you can augment the interface.

Example:
```ts
import '@lightningjs/sdk'

declare module '@lightningjs/sdk' {
  namespace Application {
    interface AppData {
      myParam1: string;
      myParam2: number;
    }
  }
}
```

By augmenting the above, the structure will be enforced while calling `Launch()` and when importing `AppData` in any part of your application:

**index.ts**
```ts
Launch(App, appSettings, platformSettings, {
  myParam1: 'abc',
  myParam2: 123
});
```

**AnotherFile.ts**
```ts
import { AppData } from '@lightningjs/sdk';

console.log(AppData.myParam1);
console.log(AppData.myParam2);
```
