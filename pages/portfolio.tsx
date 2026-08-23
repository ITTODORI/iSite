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

    <div className="drift">
      <div style={{ height: 600 }}>
          <DriftWall
            items={items}
            columns={5}
            tileWidth={200}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="#060010"
            radius={14}
            roll={0}
            pauseOnHover={false}
            grayscale
          />
        </div>
    </div>

    </>
  );
};

export default PortfolioPage;