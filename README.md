# WIP

!!! WIP !!!

This should be a web components wrapper for react components.

## Tasks (implemented but might need optimization):

- how to pass children? (Transform to Vdom?) -> works
- how to pass non string attributes(there is no list of attributes known)? -> currently JSON parsing(maybe bad for performance)
- will this work for React components that are just functions or do they have to be classes? -> Yup
- exclude `data-reactid` attributes from being passed to react -> done

## Todo:
- how to pass handlers (likely via dispatching an event)?
- avoid issues with keys

## Attribute parsing:

In React you can pass any JS type in the porperties, i.e. (`fruits={['apple', ...]}`).
Since web components are pure HTML however attribute values can only be strings.
To work around this limitation, the solution is currently JSON parsing.
Any attribute value surroundend by `{...}` will be parsed.
```
<custom-component name"won't be parsed" person="{{ "age"="will be parsed", "age": 43 }}">
</custom-component>
```
This works but we will still have to figure out how this impacts performance.
