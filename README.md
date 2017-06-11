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

## Example

You can see an example [here](https://github.com/ChristophP/web-react-components/blob/master/dev-assets/index.html).
You can also clone the repo and run `npm i` and `npm start`.
Open your browser at `http://localhost:8080/dev-assets/index.html`

## Attribute parsing:

In React you can pass any JS type in the porperties, i.e. (`fruits={['apple', ...]}`).
Since web components are pure HTML however attribute values can only be strings.
To work around this limitation, the solution is currently JSON parsing.
Any attribute value surroundend by `{...}` will be parsed.
```
<custom-component name"won't be parsed" person="{{ "age":"this object will be parsed", "age": 43 }}">
</custom-component>
```
This works but we will still have to figure out how this impacts performance.
