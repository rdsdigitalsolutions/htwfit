import { useTranslation } from 'next-i18next'
import {Grid, Loading, Text, Spacer } from '@nextui-org/react';

export default function ComponentHandler({ children }) {
  const { t } = useTranslation('common')

  return (
    <Grid.Container gap={4} justify="center">
      <Grid xs={12} justify="center">
        <Loading type="points" />
        <Spacer y={0.5} />
        <Text h4>{t('Loading')}</Text>
      </Grid>
    </Grid.Container>
  )
}
