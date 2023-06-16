import { PageNotAuthenticated } from '../../pages';
import { UserService } from '../../services'

const RenderOnAuth = ({ children, altComponent }) => (UserService.isLoggedIn())
  ? children
  : altComponent;


RenderOnAuth.defaultProps = {
  altComponent: <PageNotAuthenticated />
}

export default RenderOnAuth
