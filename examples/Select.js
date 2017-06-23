function Select(props) {
  var h = React.createElement;
  return h('div', null,
    // childern will be rendern into the label
    h('label', null, props.children),
    h('select', {
        name: props.name,
        value: props.value,
        disabled: props.disabled,
        onChange: props.onChange,
      },
      props.options.map(function(item) {
        return h('option', { value: item.value }, item.label);
      })
    )
  )
};
