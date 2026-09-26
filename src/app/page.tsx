import HeroBanner from '@/components/home/HeroBanner';
import OffersSection from '@/components/home/OffersSection';
import JoinSection from '@/components/home/JoinSection';
import VerticalCards from '@/components/home/VerticalCards';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <VerticalCards />
      <OffersSection />
      <JoinSection />
    </>
  );
}