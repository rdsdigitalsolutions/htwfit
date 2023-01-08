import { useTranslation } from 'next-i18next'
import { Grid, Loading, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';


export default function ComponentHandler({ children, text = 'Loading' }) {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <Grid.Container gap={4} justify="center">
      <Grid xs={12} justify="center">
        <Loading color="primary" textColor="primary" size="lg">
          {t(text)}
        </Loading>
      </Grid>
      <Grid xs={12} justify="center">
        <Button auto bordered size='xs' onClick={() => router.push('/')}>{t('global_return_home')}</Button>
      </Grid>
    </Grid.Container>
  )
}
