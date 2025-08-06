import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

function ScrollToUp() {
    const { pathname } = useLocation();

    console.log(useLocation());

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

  return null;
}

export default ScrollToUp;