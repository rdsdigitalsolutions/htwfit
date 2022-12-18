import { useTranslation } from 'next-i18next'
import { Text, Badge } from '@nextui-org/react';
import { FaGrinBeam } from "react-icons/fa";

import styles from '../styles/Home.module.css'

export default function ComponentHandler({ children }) {
  const { t } = useTranslation('common')

  return (
    <footer className={styles.footer}>
      <Text h6 weight='bold'>
        {process.env.NEXT_PUBLIC_APP_NAME} <Badge color="warning" size="xs" variant="flat" isSquared>{t('global_beta')}</Badge>
      </Text>
    </footer>
  )
}
