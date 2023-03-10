import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text } from '@nextui-org/react';

import Layout from '../../components/layout'

export default function ComponentHandler({ locale }) {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>
        <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '7vw', lineHeight: 'normal' }} weight="bold">
          {t('dashboard_title')}
        </Text>
        <Text >{t('global_test')}</Text>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return { redirect: { permanent: false, destination: "/" }}
  }

  return {
    props: { ...translations, locale, session },
  }
}
