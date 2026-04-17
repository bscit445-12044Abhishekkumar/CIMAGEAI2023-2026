import { Link } from "react-router-dom";

const Footer = () =>
<footer className="border-t bg-card mt-20">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="font-heading text-xl font-bold mb-3">Bazzarly</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Curated premium fashion and accessories for the discerning individual.
          </p>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Shop</h4>
          <ul className="space-y-2">
            {["New Arrivals", "Best Sellers", "Clothing", "Accessories"].map((item) =>
          <li key={item}>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              </li>
          )}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Company</h4>
          <ul className="space-y-2">
            {[
          { label: "About", to: "/about" },
          { label: "Contact", to: "/contact" },
          { label: "Careers", to: "#" },
          { label: "Press", to: "#" }].
          map((item) =>
          <li key={item.label}>
                <Link to={item.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
          )}
          </ul>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Support</h4>
          <ul className="space-y-2">
            {["FAQ", "Shipping", "Returns", "Size Guide"].map((item) =>
          <li key={item}>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              </li>
          )}
          </ul>
        </div>
      </div>
      <div className="border-t mt-12 pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bazzarly. All rights reserved.
      </div>
    </div>
  </footer>;


export default Footer;