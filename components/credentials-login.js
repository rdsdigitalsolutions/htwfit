import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'
import { signIn } from "next-auth/react"
import { Loading, Grid, Modal, Checkbox, Input, Row, Button, Text } from '@nextui-org/react';
import { FaUserCircle, FaLock, FaGrinBeam, FaChevronRight } from "react-icons/fa";

export default function ComponentHandler({ visible, setVisible, providers, locale = '' }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { query } = router

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { query.error ? handleErrorMessages(query.error): null }, [query.error] );

  const handleErrorMessages = (errorMessage) => {
    router.push('/');

    switch (errorMessage) {
      case 'CredentialsSignin':
        setError(t('errors_invalid_credentials'));
        break;
      case 'OAuthSignin':
        setError(t('errors_oauth_signin'));
        break;
      default:
        setError(t('errors_unknown'));
        break;
    }
  }

  const handleForm = () => {
    setProcessing(true);
    signIn("credentials", { username, password, redirect: false })
      .then((result) => {
        setUsername('');
        setPassword('');

        if (!result.error) {
          router.push('/admin/workout');
          setVisible(false);
          return
        }

        handleErrorMessages(result.error);
      })
      .catch((error) => setError(error))
      .finally(() => setProcessing(false))
  }

  const handleSocialLogin = (event) => {
    signIn(event.target.value, { callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${locale}`, redirect: false })
      .catch((error) => setError(error))
      .finally(() => setProcessing(false))
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visible}
      onClose={() => setVisible(false)}
      css={{margin:10}}
    >
      <Modal.Header>
        <Grid.Container>
          <Grid xs={12} justify="center">
            <Text h1><FaGrinBeam /></Text>
          </Grid>
          <Grid xs={12} justify="center">
            <Text h2>{process.env.NEXT_PUBLIC_APP_NAME}</Text>
          </Grid>
        </Grid.Container>
      </Modal.Header>

      <Modal.Body>
        {/* {providers && <Grid.Container gap={1}>
          {Object.values(providers).filter((provider) => provider.name !== 'Credentials').map((provider, index) => <Grid key={index} xs={12} justify="center">
            <Button bordered onClick={handleSocialLogin} value={provider.id}>{t('global_sign_in_with')} {provider.name}</Button>
          </Grid>)}
        </Grid.Container>} */}

        <Grid.Container gap={4}>
          <Grid xs={12} justify="center">
            <Input
              name='username'
              size="md"
              fullWidth={true}
              type="email"
              clearable
              underlined
              labelPlaceholder={t('global_username')}
              contentLeft={<FaUserCircle />}
              initialValue={username}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={processing}
            />
          </Grid>
          <Grid xs={12} justify="center">
            <Input.Password
              name='password'
              size="md"
              fullWidth={true}
              underlined
              labelPlaceholder={t('global_password')}
              contentLeft={<FaLock />}
              initialValue={password}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={processing}
            />
          </Grid>
          {/* <Grid xs={12} justify="center">
            <Row justify="space-between">
              <Checkbox>
                <Text size={14}>{t('global_remember_me')}</Text>
              </Checkbox>
              <Text size={14}>{t('global_forgot_password')}?</Text>
            </Row>
          </Grid> */}
          {error && <Grid xs={12} justify="center">
            <Text h6 color="error">{error}</Text>
          </Grid>}
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer justify="center">
        {/* {!processing ? <Button auto flat color="error" onClick={() => setVisible(false)}>{t('global_close')}</Button> : null} */}
        <Button auto shadow onClick={handleForm} disabled={processing}>
          {processing ? <Loading type="points" color="currentColor" size="sm" /> : <>{t('global_login')} <FaChevronRight /></>}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
