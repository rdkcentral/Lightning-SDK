# App

SDK provides various methods that can be used within the application.

## Available Methods

### overrideKeyMap

This method can be used to merge and override the existing keymap (coming from `settings.json`) by using a custom keymap in runtime. The method will merge all key mappings by overriding the existing key mappings with the new ones when a key is defined in both keymaps.

`keepDuplicates` flag is set to `false` by default, which means duplicated values (like two different keys trigger the `Back` action) will be removed from the final keymap. If `keepDuplicates` is set to `true`, duplicated **values** will be kept in the final keymap.

#### Usage

```js
const customKeyMap = {
    13: "Enter",
    83: "Search"
}

this.application.overrideKeyMap(customKeyMap) // keepDuplicates = false
```

or

```js
this.application.overrideKeyMap(customKeyMap, true) // keepDuplicates = true
```

#### Parameters

- `customKeyMap` : keymap object
- `keepDuplicates`: flag to keep duplicated values in the final keymap or not. The default value is `false`.
