import React from "react";
import { Navbar, Container, Col } from "react-bootstrap";

const Footer = () => {

    let year = new Date().getFullYear();
    return (
        <Navbar fixed="bottom" bg="dark" variant="dark" >
            <Container>
                <Col lg={12} className="text-center text-muted" style={{"fontFamily": "Roboto"}}>
                    <div>
                        {year}, Dasha Alexandrova
                    </div>
                </Col>
            </Container>
        </Navbar>
    );
};

export default Footer;