import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { Navbar, Link, Text, Dropdown, Avatar, Spacer, Badge } from '@nextui-org/react';
import { FaUserCircle } from "react-icons/fa";

import NavbarLink from './navbar-link'
import CredentialsLogin from './credentials-login'

export default function ComponentHandler({ children, locale, providers, session, sessionStatus, setLoadingPage }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } = router;

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => { query.error ? setLoginModalVisible(true) : null }, [query.error]);

  const handleDropdownActions = (actionKey) => {
    switch (actionKey) {
      case 'logout':
        signOut({ redirect: false });
        router.push('/');
        break;

      default:
        if (actionKey.startsWith('/')) {
          router.push(actionKey);
        } else {
          console.log('Navbar Action:', actionKey);
        }

        break;
    }
  }

  return (
    <>
      {loginModalVisible && <CredentialsLogin setVisible={setLoginModalVisible} visible={loginModalVisible} providers={providers} locale={locale} />}

      <Navbar isCompact isBordered variant="static" maxWidth="fluid">
        <Navbar.Brand>
          <Navbar.Toggle aria-label="toggle navigation" showIn="xs" />
          <Spacer x={5} />
          <Text b color="inherit">
            {process.env.NEXT_PUBLIC_APP_URL} <Badge color="warning" size="xs" variant="flat" isSquared>{t('global_beta')}</Badge>
          </Text>
        </Navbar.Brand>

        <Navbar.Content variant="underline" enableCursorHighlight >
          <NavbarLink hideIn="md" path='/' name={t('menu_home')} hideAuthenticated={sessionStatus} />
          <NavbarLink hideIn="md" path='/about' name={t('menu_about')} hideAuthenticated={sessionStatus} />
          <NavbarLink hideIn="md" path='/admin/workout' name={t('menu_admin_workout')} sessionStatus={sessionStatus} />
          <NavbarLink hideIn="md" path='/admin/planning' name={t('menu_admin_planning')} sessionStatus={sessionStatus} />
          <NavbarLink hideIn="md" path='/admin/stats' name={t('menu_admin_stats')} sessionStatus={sessionStatus} />
        </Navbar.Content>

        <Navbar.Content enableCursorHighlight css={{ "@xs": { w: "12%", jc: "flex-end" } }}>
          {sessionStatus !== 'authenticated' && <Navbar.Link onClick={() => setLoginModalVisible(true)} hideIn="xs"><FaUserCircle /><Spacer x={0.5} />{t('global_login')}</Navbar.Link>}

          {sessionStatus === 'authenticated' && <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="primary"
                  size="md"
                  src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${session.user.image}`}
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="secondary"
              onAction={handleDropdownActions}
            >
              <Dropdown.Item key="/admin/profile" css={{ height: "$20" }}>
                <Text h4 b color="inherit" css={{ d: "flex" }}>
                  {session.user.name}
                </Text>
                <Text h6 b color="inherit" css={{ d: "flex" }}>
                  {session.user.email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                {t('global_logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}

        </Navbar.Content>

        <Navbar.Collapse showIn="xs" disableAnimation css={{background: '#000'}}>
          {sessionStatus !== 'authenticated' && <Navbar.CollapseItem>
            <Link color="inherit" css={{ minWidth: "100%" }} onClick={() => setLoginModalVisible(true)}>
              {t('global_login')}
            </Link>
          </Navbar.CollapseItem>}
          <Navbar.CollapseItem>
            <NavbarLink path='/' name={t('menu_home')} hideAuthenticated={sessionStatus} type='link' setLoadingPage={setLoadingPage} />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink hideIn="md" path='/about' name={t('menu_about')} type='link' setLoadingPage={setLoadingPage} />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink path='/admin/workout' name={t('menu_admin_workout')} sessionStatus={sessionStatus} type='link' setLoadingPage={setLoadingPage} />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink path='/admin/meals' name={t('menu_admin_meals')} sessionStatus={sessionStatus} type='link' setLoadingPage={setLoadingPage} />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink path='/admin/planning' name={t('menu_admin_planning')} sessionStatus={sessionStatus} type='link' setLoadingPage={setLoadingPage} />
          </Navbar.CollapseItem>
        </Navbar.Collapse>

      </Navbar>
    </>
  )
}
