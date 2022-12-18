import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { getProviders } from "next-auth/react"

import { Text } from '@nextui-org/react';

import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function ComponentHandler({ locale, providers }) {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} providers={providers}>
        <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '7vw' }} weight="bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Text>

        <Text h6>{t('global_test')}</Text>
        <p className={styles.description}>
          {t('index_instruction')}{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>
      </Layout>
    </>
  )
}

export async function getStaticProps({ locale }) {
  const providers = await getProviders();
  const translations = (await serverSideTranslations(locale, ['common']))

  return {
    props: { ...translations, providers, locale },
  }
}
