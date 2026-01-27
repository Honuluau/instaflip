import { version } from "../App";

export function Header() {
    return (
        <div className="flex bottom m0">
            <h1 className="m0">Instaflip</h1>
            <div className="badge"><p className="m0">{version}</p></div>
        </div>
    )
}