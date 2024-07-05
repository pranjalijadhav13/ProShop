import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
/*&copy; gives us the copyright symbol*/
const Footer = () => {

const currentYear=new Date().getFullYear()
  return (
    <footer>
        <Container>
            <Row>
                <Col className='text-center py-3'>
                    <p>ProShop &copy; {currentYear}</p>
                </Col>
            </Row>

        </Container>

    </footer>
  )
}

export default Footer
