import "./footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fab);

const Footer = () => (
    
    <div className="footer">
        <div className="footer-content">
            {/* <p className="footer-p">About</p> */}
            <a className="profile-link" href="https://github.com/corquaid/react-iss-tracker" target="blank">
                <FontAwesomeIcon className="awesome-icon" icon={['fab', "github"]}/>
                corquaid
            </a>
        </div>
    </div>
);

export default Footer;
