import Head from 'next/head'
import moment from 'moment';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { Text, Grid, Card, Button, Spacer, Badge } from '@nextui-org/react';
import { FaPlay } from "react-icons/fa";
import { useTheme } from '@nextui-org/react';

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { authOptions } from "../../api/auth/[...nextauth]"
import { findOne } from '../../../repository/plan'
import Layout from '../../../components/layout'

export default function ComponentHandler({ locale, initialActivePlan }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { isDark } = useTheme();

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [processing, setProcessing] = useState(false);
  const [activePlan, setActivePlan] = useState(initialActivePlan);

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true} loading={processing}>
        <Spacer y={1} />
        <Grid.Container gap={0} justify="center">
          <Grid xs={12} justify="center">
            <Text h4 css={{ textAlign: 'center', textGradient: "45deg, $blue600 -20%, $pink600 50%", lineHeight: 'normal' }}>
              {activePlan.goal}
            </Text>
          </Grid>

          <Grid xs={12} justify="center">
            <Text h6 color='gray' css={{ textAlign: 'center' }}>
              {activePlan.observations}
            </Text>
          </Grid>
        </Grid.Container>

        <Spacer y={0.5} />
        {(activePlan.exercises || []).map((exercise, index) => <div key={index} >
          <Spacer y={0.8} />
          <Badge disableOutline isSquared content={`${(exercise.done.reduce((acc, curr) => acc + (curr.duration || 0), 0) / (exercise.done.length || 1)).toFixed(0)}min ${t('global_duration')} `} size="sm" placement="top-right" variant="bordered" horizontalOffset="10%" verticalOffset="-5%" color='primary'>
            <Card>
              <Card.Body>
                <Grid.Container>
                  <Grid xs={4} justify="center">
                    <Grid.Container>
                      <Grid xs={12} justify="center">
                        <div style={{ width: "80%" }}>
                          <CircularProgressbar
                            value={(exercise.done.length / (activePlan.lengthInWeeks * exercise.days.length) * 100).toFixed(0)}
                            text={`${(exercise.done.length / (activePlan.lengthInWeeks * exercise.days.length) * 100).toFixed(0)}%`}
                            strokeWidth={15}
                            styles={buildStyles({
                              backgroundColor: '#3e98c7',
                              textColor: isDark ? '#c6c6c6' : '#000',
                              pathColor: "#2abe0c",
                              trailColor: isDark ? '#000' : '#f3f3f4',
                              textSize: "25px"
                            })}
                          />
                        </div>
                      </Grid>
                      <Spacer y={0.2} />
                      <Grid xs={12} justify="center">
                        <Text small color='gray'>
                          {t('global_done')} {exercise.done.length} {t('global_of')} {(activePlan.lengthInWeeks * exercise.days.length)}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Grid xs={8} justify="left">
                    <Grid.Container gap={0}>
                      <Grid xs={12} justify="left">
                        <Text h1 css={{ textAlign: 'left', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '4.5vw', lineHeight: 'normal' }} weight="bold">
                          {exercise.title}
                        </Text>
                      </Grid>
                      <Grid xs={12} justify="left">
                        <Text small color='gray'>
                          {t('global_exercises_to_complete').replace('**', exercise.training.length)}
                        </Text>
                      </Grid>
                      <Spacer y={0.2} />
                      <Grid xs={12} justify="left">
                        <Text h6 css={{ textAlign: 'left', fontSize: '3.5vw' }}>
                          {exercise.observations}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Spacer y={0.8} />
                  {exercise.done.length < (activePlan.lengthInWeeks * exercise.days.length) && !exercise.done.find((done) => moment(done.date).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) && <>
                    <Grid xs={12} justify="center">
                      <Button auto size='md' type="submit" color={exercise.days.find(dayOfWeek => String(dayOfWeek) === String(moment().format('d'))) ? 'primary' : 'gray'} onClick={() => router.push(`/admin/workout/${exercise.id}`)}>
                        {exercise.days.map(dayOfWeek => t(`global_${weekday[dayOfWeek]}`)).join(' / ')} <Spacer x={0.3} /> <FaPlay />
                      </Button>
                    </Grid>
                  </>}
                </Grid.Container>
              </Card.Body>
            </Card>
          </Badge>
        </div>)}

        <Spacer y={1} />
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
  
  const initialActivePlan = await findOne({ userId: session.user.id });

  if (!initialActivePlan || initialActivePlan.terminatedAt) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/planning/dashboard"
      }
    }
  }

  return {
    props: { ...translations, locale, initialActivePlan },
  }
}
