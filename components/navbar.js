import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { Switch, useTheme, Navbar, Link, Text, Dropdown, Avatar, Spacer, Badge } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes'
import { FaUserCircle, FaMoon, FaSun, FaGlobeAmericas, FaGrinBeam } from "react-icons/fa";

import NavbarLink from './navbar-link'
import CredentialsLogin from './credentials-login'

export default function ComponentHandler({ children, locale, providers, session, sessionStatus }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(new Set([locale]));

  useEffect(() => { query.error ? setLoginModalVisible(true) : null }, [query.error]);

  const handleLocale = (nextLocale) => {
    setCurrentLocale(new Set([nextLocale]));
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  }

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
          <Spacer x={0.5} />
          <Text b color="inherit" hideIn="xs">
            {process.env.NEXT_PUBLIC_APP_NAME} <Badge color="warning" size="xs" variant="flat" isSquared>{t('global_beta')}</Badge>
          </Text>
        </Navbar.Brand>

        <Navbar.Content variant="underline" enableCursorHighlight >
          <NavbarLink hideIn="md" path='/' name={t('menu_home')} hideAuthenticated={sessionStatus} />
          <NavbarLink hideIn="md" path='/about' name={t('menu_about')} hideAuthenticated={sessionStatus} />
          <NavbarLink path='/admin/workout' name={t('menu_admin_workout')} sessionStatus={sessionStatus} />
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

          <Dropdown isBordered>
            <Navbar.Item>
              <Dropdown.Button
                auto
                light
                css={{
                  px: 0,
                  dflex: "center",
                  svg: { pe: "none" },
                }}
                ripple={false}
              >
                <FaGlobeAmericas />
              </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
              onAction={handleLocale}
              selectedKeys={currentLocale}
              aria-label="ACME features"
              css={{
                $$dropdownMenuWidth: "340px",
                $$dropdownItemHeight: "70px",
                "& .nextui-dropdown-item": {
                  py: "$4",
                  // dropdown item left icon
                  svg: {
                    color: "$secondary",
                    mr: "$4",
                  },
                  // dropdown item title
                  "& .nextui-dropdown-item-content": {
                    w: "100%",
                    fontWeight: "$semibold",
                  },
                },
              }}
            >
              <Dropdown.Item
                key="en-US"
                showFullDescription
                description="Translate the site to english."
              // icon={icons.scale}
              >
                English US
              </Dropdown.Item>
              <Dropdown.Item
                key="pt-BR"
                showFullDescription
                description="Traduzir este site para Português."
              // icon={icons.activity}
              >
                Português Brasil
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Navbar.Item>
            <Switch
              // css={{ background: '$inactive' }}
              color="default"
              checked={isDark}
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              iconOn={<FaMoon />}
              iconOff={<FaSun />}
            />
          </Navbar.Item>

        </Navbar.Content>

        <Navbar.Collapse showIn="xs">
          {sessionStatus !== 'authenticated' && <Navbar.CollapseItem>
            <Link color="inherit" css={{ minWidth: "100%" }} onClick={() => setLoginModalVisible(true)}>
              {t('global_login')}
            </Link>
          </Navbar.CollapseItem>}
          <Navbar.CollapseItem>
            <NavbarLink path='/' name={t('menu_home')} hideAuthenticated={sessionStatus} type='link' />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink hideIn="md" path='/about' name={t('menu_about')} hideAuthenticated={sessionStatus} type='link' />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink path='/admin/planning' name={t('menu_admin_planning')} sessionStatus={sessionStatus} type='link' />
          </Navbar.CollapseItem>
          <Navbar.CollapseItem>
            <NavbarLink path='/admin/stats' name={t('menu_admin_stats')} sessionStatus={sessionStatus} type='link' />
          </Navbar.CollapseItem>
        </Navbar.Collapse>

      </Navbar>
    </>
  )
}
