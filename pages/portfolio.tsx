import PillNav from './component/Navbar';
import DriftWall from './component/DriftWall';

const PortfolioPage = () => {
  const items = [
    { image: 'https://picsum.photos/id/1015/600/400', title: 'Peaks', href: 'https://example.com/one' },
    { image: 'https://picsum.photos/id/1025/600/400', title: 'Pup', href: 'https://example.com/two' },
    { image: 'https://picsum.photos/id/1039/600/400', title: 'Falls', href: 'https://example.com/three' },
  ];

  return (
    <>
    <div>
      <h1>Creative Technologist</h1>
      <p>I embed with your product teams to set design direction, build the systems and raise the bar on strategy, efficiency and craft.</p>
    </div>

    <div className="navbar">
      <PillNav
          logo="/file.svg"
          logoAlt="Company Logo"
          items={[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Contact', href: '/contact' }
          ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            initialLoadAnimation={false}
       />
    </div>

    </>
  );
};

export default PortfolioPage;