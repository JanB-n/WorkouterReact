import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Header from "./Header";

const LayoutContext = React.createContext(null);

function MainLayout({children}) {

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Header />
        </Col>
      </Row>
      <Row>
      <Col>
        <Row>
          {children}
        </Row>
      </Col>
      </Row>
    
    </Container>
  );
}

export default MainLayout