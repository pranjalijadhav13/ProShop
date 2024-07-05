/*Now we're going to have a couple forms, the login form, the register, and I believe a couple others.

So I want to actually create a form container component that we can wrap these forms in.

That'll give it a, you know, it'll make it less wide. */
import {Container, Row, Col} from 'react-bootstrap'

import React from 'react'

/*So on medium screens, it will justify the content to the center. */
/*And now we just want to put in the children, which is going to be passed in as a prop.

So now we can just wrap whatever we want in this form container component. */
const FormContainer = ({children}) => {
  return (
    <Container>
        <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
                {children}
            </Col>

        </Row>
    </Container>
  )
}

export default FormContainer

//So in screens we're going to create a login screen dot js.