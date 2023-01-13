import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Container, Spacer } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

import styles from '../styles/Home.module.css'
import Footer from './footer'
import Navbar from './navbar'
import LoadingPage from './loading-page'

export default function ComponentHandler({ children, locale, providers, loading = false, restricted = false }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [loadingPage, setLoadingPage] = useState(loading);

  useEffect(() => { setLoadingPage(loading) }, [loading]);

  const { data: session, status: sessionStatus } = useSession({
    required: restricted,
    onUnauthenticated() {
      router.push('/');
    }
  });

  if (loadingPage || (restricted && sessionStatus === 'loading')) {
    return <Container fluid className={styles.main}>
      <Spacer y='14' />
      <LoadingPage style={{ backgroundColor: 'blue' }} text={t('global_loading')} />
    </Container>
  }

  return (
    <>
      <Navbar locale={locale} providers={providers} session={session} sessionStatus={sessionStatus} setLoadingPage={setLoadingPage} />
      <Container className={styles.main}>
        {children}
      </Container>
      <Footer />
    </>
  )
}
