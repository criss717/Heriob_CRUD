import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import s from '../NavBar/NavBar.module.css';
import SelectComponent from '../SelectComponent/SelectComponent';

function NavBar() {
  return (
    <Navbar expand="lg" data-bs-theme="dark" className="row bg-body-tertiary vw-100">
      <Container fluid>
        <Navbar.Brand href="#">
          <img className={`${s.imgLogo}`} src="images.png" alt="" />
        </Navbar.Brand>
        {/* No incluyas el Navbar.Toggle y Navbar.Collapse */}
        <Nav
          className="me-auto my-2 my-lg-0 col-3"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          <Nav.Link href="#action1">Home</Nav.Link>
          <Nav.Link href="#action2">Link</Nav.Link>
          <NavDropdown title="Link" id="navbarScrollingDropdown">
            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="#" disabled>
            Link
          </Nav.Link>
        </Nav>
        <div className={`${s.selected} col-6 text-center`}>
          <SelectComponent />
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
