import {Container, Nav, Navbar} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGithub} from '@fortawesome/free-brands-svg-icons'

type NavBarProps = {
  useTheme: any
}
const NavigationBar = ({useTheme}: NavBarProps) => {
  const {toggleTheme} = useTheme()

  return (
    <Navbar bg="light" expand="xl">
      <Container fluid>
        <Navbar.Brand>
          <FontAwesomeIcon icon={faGithub} />
          <a href="https://github.com/TXC">TXC</a> /
          <a className="font-weight-bold" href="https://github.com/TXC/d2s-editor">d2s-editor</a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#" onClick={toggleTheme}>Change Theme</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
