import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="text-[#252422] bg-[#f5f5f5] px-4 md:px-12 md:text-lg">
      <h3 className="border-t border-[#252422] pt-4 pb-6 italic">
        Designed and dveloped by <Link to="/" className='text-[#944424]'>Tunde James</Link>
      </h3>
    </footer>
  );
};

export default Footer;
