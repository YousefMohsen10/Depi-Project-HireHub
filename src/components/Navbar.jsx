import logo from '../assets/Brandmark.svg'
import './Navbar.css';
function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container py-3">
                    <a className="navbar-brand d-flex " href="#">
                        <img src={logo} alt="" className="mx-2" />
                        <span className="fs-4 fw-bold">HireHub</span>
                        </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item mx-2 fw-bold">
                                <a className="nav-link active" aria-current="page" href="#">Find Jobs</a>
                            </li>
                            <li className="nav-item mx-2 fw-bold">
                                <a className="nav-link" aria-current="page" href="#">Companies</a>
                            </li>
                            <li className="nav-item mx-2 fw-bold">
                                <a className="nav-link" aria-current="page" href="#">Post a job</a>
                            </li>
                            <li className="nav-item mx-2 fw-bold">
                                <a className="nav-link" aria-current="page" href="#">About</a>
                            </li>
                        </ul>
                        <button className='btn btn-md text-primary rounded-3 mx-2 border border-2 fw-bold login '> <i class="fa-solid fa-arrow-right-to-bracket"></i> Login</button>
                        <button className='btn btn-md btn-primary rounded-3 mx-2 fw-bold'>Sign Up</button>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;