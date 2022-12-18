import { useState } from 'react';
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { useForm, Controller } from "react-hook-form";
import { Card, Grid, Input, Text, Button, Loading, Avatar } from '@nextui-org/react';

import { authOptions } from "./../api/auth/[...nextauth]"
import Layout from '../../components/layout'
import DefaultFetch from '../../lib/default-fetch'

export default function ComponentHandler({ locale, session }) {
  const { t } = useTranslation('common');

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      fullName: session.user.name,
      email: session.user.email,
    }
  });

  const onSubmit = data => {
    setProcessing(true);

    DefaultFetch({
      url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/user`,
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((data) => {
        if (data.error) setError(data.error);
        console.log('Save Profile Response:', data);
      })
      .finally(() => setProcessing(false))
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true} >
        <Grid.Container gap={4} justify="center">
          <Grid xs={12} md={6} >
            <Card>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Card.Header>
                  <Grid.Container css={{ pl: "$6" }}>
                    <Grid xs={12} justify="center">
                      <Avatar
                        bordered
                        color="primary"
                        size="xl"
                        src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${session.user.image}`}
                      />
                    </Grid>
                    <Grid xs={12} justify="center">
                      <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '4vw' }} weight="bold">{t('account_title')}</Text>
                    </Grid>
                  </Grid.Container>
                </Card.Header>

                <Card.Body>
                  <Grid xs={12}>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input
                        {...field}
                        size="md"
                        fullWidth={true}
                        type="text"
                        underlined
                        labelPlaceholder={t('global_full_name')}
                        disabled={processing}
                      />}
                    />

                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => <Input
                        {...field}
                        size="md"
                        fullWidth={true}
                        type="text"
                        underlined
                        labelPlaceholder={t('global_username')}
                        disabled={processing}
                      />}
                    />

                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="currentPassword"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => <Input.Password
                        {...field}
                        size="md"
                        fullWidth={true}
                        type="text"
                        underlined
                        labelPlaceholder={t('global_current_password')}
                        disabled={processing}
                      />}
                    />

                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="newPassword"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => <Input.Password
                        {...field}
                        size="md"
                        fullWidth={true}
                        type="text"
                        underlined
                        labelPlaceholder={t('global_new_password')}
                        disabled={processing}
                      />}
                    />

                  </Grid>
                  <Grid xs={12}>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => <Input.Password
                        {...field}
                        size="md"
                        fullWidth={true}
                        type="text"
                        underlined
                        labelPlaceholder={t('global_password_confirmation')}
                        disabled={processing}
                      />}
                    />
                  </Grid>

                  {error && <Grid xs={12}>
                    <Text h6 color="error">{error}</Text>
                  </Grid>}
                </Card.Body>

                <Card.Footer>
                  <Grid xs={12} justify="center">
                    {/* <Button auto flat onClick={handleForm} disabled={processing}> */}
                    <Button auto flat disabled={processing} type="submit">
                      {processing ? <Loading type="points" color="currentColor" size="lg" /> : t('global_save')}
                    </Button>
                  </Grid>
                </Card.Footer>
              </form>
            </Card>
          </Grid>
        </Grid.Container>

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)

  return {
    props: { ...translations, locale, session },
  }
}
