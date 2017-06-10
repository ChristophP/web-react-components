import React from 'react';
import ReactDOM from 'react-dom';

const MyButton = props => {
  console.log(props);
  return <button>Peter</button>
};

ReactDOM.render(<MyButton />, document.getElementById('root'));
