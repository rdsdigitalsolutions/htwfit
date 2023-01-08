import { useRouter } from 'next/router';
import { Navbar, Link } from '@nextui-org/react';

export default function ComponentHandler({ sessionStatus, path, name, hideAuthenticated, hideIn, setLoadingPage, type = 'navbar' }) {
  const router = useRouter();
  const isActive = router.asPath === path
  const handleClick = (event) => {
    event.preventDefault();
    setLoadingPage(true);
    router.push(path);
  }

  const element = type === 'navbar' ? <Navbar.Link onClick={handleClick} hideIn={hideIn} isActive={isActive} >{name}</Navbar.Link> : <Link onClick={handleClick}>{name}</Link>;

  if (hideAuthenticated === 'authenticated') {
    return null;
  }

  if (sessionStatus) {
    return sessionStatus !== 'authenticated' ? null : element
  }

  return element
}
