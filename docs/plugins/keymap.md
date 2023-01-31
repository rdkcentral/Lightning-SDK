# Keymap

## Usage

SDK provides an option to over-ride the default keymap with the new keymap.

This can be done using the below snippet :

```js
this.application.overRideKeyMap(customKeyMap, keepDefaults)
```

By default `keepDefaults` will be false.

`customKeyMap` : Keymap to be overidden

`keepDefaults`: Flag to overide the the default keymap or not.

If set to `false`, it will override the existing keymap.

If set to `true`, it will be merged with the base keymap along with the exsiting keymap, where it has all the keys which has same values.

