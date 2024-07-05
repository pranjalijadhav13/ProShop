import React from 'react'
import { Alert } from 'react-bootstrap'
/*And then what we want to bring in here is the alert component from React Bootstrap.

So let's say import and then alert from React Bootstrap.

And this is going to take in two props.

So let's destructure and it's going to take a variant.

So variant and then children.

So variant is just like if it's a danger.

So if we want it to be read or if we want it to be success, which would be green, etcetera, and then

children is just whatever.

We're wrapping it, right?

If we have a message that says Hello, some text that says hello and we wrap it in the message component,

then that hello is going to be spit out here. */
const Message = ({variant , children}) => {
  return (
    <Alert variant = {variant}>{children}</Alert>
  )
}

Message.defaultProps={
    variant:"info"
}

export default Message
