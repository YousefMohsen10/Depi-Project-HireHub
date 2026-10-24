import './Footer.css';
import logo from '../assets/Brandmark.svg'
function Footer() {
    return (
        <>
            <footer className="mt-5 p-4 footer-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 mt-2">
                            <a href="/" className='d-flex text-decoration-none'>
                                <img src={logo} alt="" className="white-svg" />
                                <span className='mx-2 fs-4 fw-bold text-white'>HireHub</span>
                            </a>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <ul className='list-unstyled'>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">For Job Seekers</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Find Jobs</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Companies</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Career Advice</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <ul className='list-unstyled'>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">For Employers</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Post a Job</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Talent Solutions</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Pricing</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12">
                            <ul className='list-unstyled'>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Company</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">About Us</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Blog</a></li>
                                <li className='my-3'><a href="" className="text-decoration-none text-footer">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr className='text-footer w-100' />
                    <div className="mt-5">
                        <p className='fw-semibold text-footer text-center'> &copy; 2026 HireHub. All rights reserved.  </p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;