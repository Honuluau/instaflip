import { version } from "../App";
import logo from "../assets/images/InstaFlip-Logo.png";

export function Header() {
    return (
        <div className="header">
            <img src={logo} width={40}/>
            <h1 className="m0">InstaFlip</h1>
            <div className="badge"><p className="m0">{version}</p></div>
        </div>
    )
}