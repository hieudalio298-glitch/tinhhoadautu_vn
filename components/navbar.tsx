
import { NavbarClient } from "./navbar-client"
import AuthButton from "./auth-button"

export function Navbar() {
    return (
        <NavbarClient authButton={<AuthButton />} />
    )
}
