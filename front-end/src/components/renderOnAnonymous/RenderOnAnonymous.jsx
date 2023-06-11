import { UserService } from "../../services"

const RenderOnAnonymous = ({ children }) => (!UserService.isLoggedIn()) && children;

export default RenderOnAnonymous
