import { useTranslation } from 'next-i18next'
import { Grid, Loading, Text, Spacer } from '@nextui-org/react';

export default function ComponentHandler({ children, text='Loading' }) {
  const { t } = useTranslation('common')

  return (
    <Grid.Container gap={4} justify="center">
      <Grid xs={12} justify="center">
        <Text h4 i>{t(text)}</Text>
        <Spacer x={0.5} />
        <Loading type="points" />
      </Grid>
    </Grid.Container>
  )
}
