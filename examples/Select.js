function Select(props) {
  console.log(props)
  var h = React.createElement;
  return h('div', null,
    props.children,
    h('select', { value: props.value, disabled: props.disabled, onChange: props.onChange },
      props.options.map(function(item) {
        return h('option', { value: item.value }, item.label);
      })
    )
  )
};
