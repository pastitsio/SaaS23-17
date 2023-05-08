import { UserService } from "../../services"

const RenderOnAnonymous = ({ children }) => (!UserService.isLoggedIn()) ? children : null;

export default RenderOnAnonymous
