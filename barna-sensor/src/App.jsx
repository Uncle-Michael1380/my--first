import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ProductsSection from "./components/ProductsSection.jsx";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        پرش به محتوای اصلی
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <ProductsSection />
      </main>
    </>
  );
}
