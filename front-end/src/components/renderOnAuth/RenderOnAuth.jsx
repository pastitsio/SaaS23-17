import UserService from '../../services'

const RenderOnAuth = ({ children }) => (UserService.isLoggedIn()) ? children : null;

export default RenderOnAuth
