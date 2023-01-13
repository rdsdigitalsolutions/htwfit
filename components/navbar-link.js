import { useRouter } from 'next/router';
import { Navbar, Link } from '@nextui-org/react';
import css from 'styled-jsx/css';

export default function ComponentHandler({ sessionStatus, path, name, hideAuthenticated, hideIn, setLoadingPage, type = 'navbar' }) {
  const router = useRouter();
  const isActive = router.asPath === path
  const handleClick = (event) => {
    event.preventDefault();
    setLoadingPage(true);

    if (router.pathname === path) {
      setLoadingPage(false);
    } else {
      router.push(path);
    }
  }

  const element = type === 'navbar' ? <Navbar.Link onClick={handleClick} hideIn={hideIn} isActive={isActive} color="secondary">{name}</Navbar.Link> : <Link onClick={handleClick} color={router.pathname === path ? 'secondary' : 'primary'} css={{fontSize:'$xl'}}>{name}</Link>;

  if (hideAuthenticated === 'authenticated') {
    return null;
  }

  if (sessionStatus) {
    return sessionStatus !== 'authenticated' ? null : element
  }

  return element
}
