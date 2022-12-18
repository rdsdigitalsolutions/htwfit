import { useRouter } from 'next/router';
import { Navbar, Link } from '@nextui-org/react';

export default function ComponentHandler({ sessionStatus, path, name, hideAuthenticated, hideIn, type = 'navbar' }) {
  const router = useRouter();
  const isActive = router.asPath === path
  const handleClick = (event) => {
    event.preventDefault();
    router.push(path);
  }

  const props = {
    hideIn,
    onClick: handleClick,
    isActive
  }

  const element = type === 'navbar' ? <Navbar.Link {...props}>{name}</Navbar.Link> : <Link {...props}>{name}</Link>;

  if (hideAuthenticated === 'authenticated') {
    return null;
  }

  if (sessionStatus) {
    return sessionStatus !== 'authenticated' ? null : element
  }

  return element
}
