export const scrollToSection = (sectionId, navigate) => {
  // If we're not on the home page, navigate there first
  if (window.location.pathname !== '/') {
    navigate('/');
  }

  // Wait for the page to load and then scroll to the section
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
}; 