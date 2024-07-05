/*So now what I want to do is show the number of items in our cart in the header.

And this is really important because I'm going to show you how you can select anything you want from

your global state.

And it doesn't matter which slice it is or what part of your state it is, and we can do it with a hook

from React Redux called Use Selector, just like we have use dispatch from React Redux, which is used

to dispatch an action such as Add to Cart, which we just did.

You can also use use selector if you just need to select something from the state. */
import {Navbar, Nav, Container, Badge, NavDropdown} from 'react-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import logo from '../assets/logo.png'
import {LinkContainer} from 'react-router-bootstrap'
/*for NavBar expand is set to large so that hamburger menu will show up when we go below large*/
/*Container inside Navbar so that the inner elements of navbar don't stretch all the way to the edges of the browser*/
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../slices/usersApiSlice'
import {logout} from '../slices/authSlice'
import SearchBox from './SearchBox'

const Header = () => {

    //state.cart is coming from our store
    const {cartItems}=useSelector((state)=> state.cart);

    const {userInfo} = useSelector((state)=> state.auth);

    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [logoutApiCall] =  useLogoutMutation();
    const logoutHandler = async()=>{
        try{
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login')
        }catch(error){
            console.log(error)
        }
    }

    return (
    <header>
        
        <Navbar bg="dark" variant="dark"  expand="md" collapseOnSelect> 
            
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="ProShop" />
                        ProShop
                    </Navbar.Brand>
                
                </LinkContainer>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className = "ms-auto">
                        <SearchBox/>
                        <LinkContainer to="/cart">
                            <Nav.Link><FaShoppingCart/>Cart
                            {   
                                /*And let's see, we're going to pass in pill as an attribute because we want I think that has to do with

                                like the roundness of it.

                                And then the background.

                                So you can use like danger success info.

                                I'm going to use success, which is green by default. */
                                cartItems.length> 0 && (
                                    <Badge pill bg='success' style={{marginLeft:'5px'}}>

                                    {cartItems.reduce((a,c)=> a+c.qty,0)}
                                    </Badge>
                                )
                            }
                            </Nav.Link>
                        </LinkContainer>
                        {
                        /*Now I'd like to show up on the NavBar instead of sign in.

I                        I want a link to the profile when user is logged in */
                        userInfo ? (
                            <>
                            <NavDropdown title={userInfo.name} id='username'>
                                <NavDropdown.Item as={Link} to='/profile'>
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            </>
                        ) : (
                            <Nav.Link as={Link} to='/login'>
                            <FaUser /> Sign In
                            </Nav.Link>
                        )}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>Orders</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                       
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>

    </header>
  )
}

export default Header
