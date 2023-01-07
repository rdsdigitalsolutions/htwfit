import Head from 'next/head'
import moment from 'moment';
import { useState } from 'react';
import { unstable_getServerSession } from "next-auth/next"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text, Spacer, Grid, Card, Badge, Button } from '@nextui-org/react';

import { authOptions } from "../../api/auth/[...nextauth]"
import { findAll } from '../../../repository/plan'

import Layout from '../../../components/layout'
import { FaPlus } from 'react-icons/fa';

export default function ComponentHandler({ locale, userPlans }) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [myPlans, setMyPlans] = useState(userPlans);

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>
        <Spacer y={0.3} />

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={12} justify="center">
            <Button auto size='sm' color='success'><FaPlus /><Spacer x={0.2} /> Add new plan</Button>
          </Grid>
        </Grid.Container>

        {/* <Grid.Container gap={0.5} justify="center">
          <Grid xs={12} justify="center">
            <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '8vw' }} weight="bold">
              {t('My Plans')}
            </Text>
          </Grid>
        </Grid.Container> */}

        <Spacer y={2} />

        {myPlans.map((currentPlan, index) => (<>
          <Badge disableOutline isSquared content="68% Done" size="sm" placement="top-right" horizontalOffset="5%" verticalOffset="-5%" color="primary">
            <Card key={index}>
              <Card.Body>
                <Grid.Container gap={0} justify="center">
                  <Grid xs={12} justify="center">
                    <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '6vw' }}>
                      {currentPlan.goal}
                    </Text>
                  </Grid>
                  <Grid xs={12} justify="center">
                    <Text h6>
                      {moment(currentPlan.createdAt).format('DD/MM/YYYY')} to {moment(currentPlan.terminatedAt).format('DD/MM/YYYY')} ({currentPlan.lengthInWeeks} Weeks Plan)
                    </Text>
                  </Grid>
                  <Grid xs={12} justify="center">
                    <Badge isSquared variant="bordered">
                      {currentPlan.exercises.length} Exercises
                    </Badge>
                    <Spacer x={0.2} />
                    <Badge isSquared variant="bordered">
                      {currentPlan.foodPLan.meals.length} Meals
                    </Badge>
                    <Spacer x={0.2} />
                    <Badge isSquared variant="bordered">
                      {(currentPlan.exercises.reduce((acc, curr) => acc + (curr.done.reduce((subAcc, subCurr) => subAcc + subCurr.duration, 0) / curr.done.length), 0) / currentPlan.exercises.length).toFixed(0)} min. Avg. Session
                    </Badge>
                  </Grid>
                  <Spacer y={1} />
                  <Grid xs={12} justify="center">
                    <Button size='sm' color='primary'><FaPlus /><Spacer x={0.2} /> Start New</Button>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Badge>
        </>))}



      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)
  const userPlans = await findAll({ userId: session.user.id });
  const currentUserPlan = userPlans.find((plan) => !plan.terminatedAt);

  if (currentUserPlan) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/planning"
      }
    }
  }

  return {
    props: { ...translations, locale, userPlans, session },
  }
}
