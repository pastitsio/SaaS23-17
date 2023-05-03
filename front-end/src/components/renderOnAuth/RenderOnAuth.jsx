import { PageNotAuthorized } from '../../pages';
import { UserService } from '../../services'

const RenderOnAuth = ({ children, altComponent }) => (UserService.isLoggedIn())
  ? children
  : altComponent;


RenderOnAuth.defaultProps = {
  altComponent: <PageNotAuthorized />
}

export default RenderOnAuth
