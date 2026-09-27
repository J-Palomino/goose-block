import { useColorMode } from '@docusaurus/theme-common';

export const DaisyLogo = (props: { className?: string }) => {
  const { colorMode } = useColorMode();
  
  const logoSrc = colorMode === 'dark' 
    ? 'img/daisy-logo-white.png' 
    : 'img/daisy-logo-black.png';
  
  const logoAlt = 'daisy logo';

  return (
    <img
      src={logoSrc}
      alt={logoAlt}
      className={props.className}
      style={{ height: 'auto', maxWidth: '100%' }}
    />
  );
};
