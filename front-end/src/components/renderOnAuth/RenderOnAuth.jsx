import { UserService } from '../../services'

const RenderOnAuth = ({ children, altComponent }) => (UserService.isLoggedIn()) ? children : altComponent;

export default RenderOnAuth
