import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import AboutPreview from '../components/sections/AboutPreview';
import ServicesPreview from '../components/sections/ServicesPreview';
import PacksSection from '../components/sections/PacksSection';
import FormationsPreview from '../components/sections/FormationsPreview';
import ProjectsSection from '../components/sections/ProjectsSection';
import Testimonials from '../components/sections/Testimonials';
import CTABanner from '../components/sections/CTABanner';
import '../pages/Projects.css';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <AboutPreview />
      <ServicesPreview />
      <PacksSection />
      <FormationsPreview />
      <ProjectsSection preview={true} />
      <Testimonials />
      <CTABanner />
    </>
  );
}

