import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import LandingFooter from '../components/landing/LandingFooter';
import VehicleCatalogPage from './public/VehicleCatalogPage';

function LandingPage() {
  return (
    <div className="rc-landing-page">
      <LandingNavbar />
      <main>
        <HeroSection />
        <section className="rc-landing-fleet py-5">
          <VehicleCatalogPage />
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
