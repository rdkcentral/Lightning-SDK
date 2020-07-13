# Router

## Data providing

In addition to Lightning's default [life-cycle events](https://rdkcentral.github.io/Lightning/docs/components/overview#component-events) the Router plugin provides some extra events your app can listen to.

### _onDataProvided()

When you use [data providing](./plugins/router/dataproviding.md) the `_onDataProvided`-method will be invoked when
the `on`, `before` or `after` data provider has resolved.

### _onMounted()

When a Page (Lightning Component) is created by the Router plugin the `_onMounted`-method will be invoked.

### _onChanged()

When a Page instance is being re-used between navigations the `_onChanged` method will be invoked.

For example:

- from `Router.navigate("home/playback/12/10")`
- to `Router.navigate("home/playback/293/99")`
<br /><br />

Next: [Page transitions](plugins/router/pagetransitions.md)
