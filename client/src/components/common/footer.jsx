import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6 md:px-12">
        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4">About Us</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop/about-us"
                  className="hover:text-gray-100 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/privacy-policy"
                  className="hover:text-gray-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/terms-conditions"
                  className="hover:text-gray-100 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold text-lg text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop/contact-us"
                  className="hover:text-gray-100 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>Email: support@yourdomain.com</li>
              <li>Phone: +1 234 567 890</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-lg text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                {/* Add actual icons using libraries like FontAwesome or HeroIcons */}
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
