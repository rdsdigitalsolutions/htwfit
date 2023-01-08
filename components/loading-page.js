import { useTranslation } from 'next-i18next'
import { Grid, Loading, Text, Spacer } from '@nextui-org/react';

export default function ComponentHandler({ children, text = 'Loading' }) {
  const { t } = useTranslation('common')

  return (
    <Grid.Container gap={4} justify="center">
      <Grid xs={12} justify="center">
        <Loading color="primary" textColor="primary">
          {t(text)}
        </Loading>
      </Grid>
    </Grid.Container>
  )
}
