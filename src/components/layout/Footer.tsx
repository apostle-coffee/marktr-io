import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-accent-grey bg-neutral-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="font-fraunces text-xl font-bold text-text-dark mb-4">
              ICP Generator
            </h3>
            <p className="text-sm text-text-dark/80">
              AI-powered Ideal Customer Profile generation for your business.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-inter font-semibold text-text-dark mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-inter font-semibold text-text-dark mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/account" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Account
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-inter font-semibold text-text-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-dark/80 hover:text-button-green transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-accent-grey text-center text-sm text-text-dark/80">
          <p>&copy; {new Date().getFullYear()} ICP Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

