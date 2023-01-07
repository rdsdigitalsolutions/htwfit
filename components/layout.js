import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';

import Footer from './footer'
import Navbar from './navbar'
import Loading from './loading-page'
import { Container } from '@nextui-org/react';

import styles from '../styles/Home.module.css'

export default function ComponentHandler({ children, locale, providers, loading = false, restricted = false }) {
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession({
    required: restricted,
    onUnauthenticated() {
      router.push('/');
    }
  });

  if (loading || (restricted && sessionStatus === 'loading')) {
    return <Container fluid className={styles.main}><Loading /></Container>
  }

  return (
    <>
      <Navbar locale={locale} providers={providers} session={session} sessionStatus={sessionStatus} />
      <Container className={styles.main}>
        {children}
      </Container>
      <Footer />
    </>
  )
}
