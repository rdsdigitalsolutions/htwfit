import Head from 'next/head'
import moment from 'moment';
import { useState } from 'react';
import { unstable_getServerSession } from "next-auth/next"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text, Grid, Button, Card, Progress, Badge, Spacer } from '@nextui-org/react';
// import { FaPlay, FaAngleDoubleLeft, FaAngleDoubleRight, FaAward, FaSearch, FaCheck, FaGoogle, FaYoutube } from "react-icons/fa";
// import { render } from "react-dom";

import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from '../../components/layout'
import { authOptions } from "./../api/auth/[...nextauth]"
import { findAll } from '../../repository/plan'
import LoadingPage from '../../components/loading-page'
import DefaultFetch from '../../lib/default-fetch'


export default function ComponentHandler({ locale, currentUserPlan }) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [currentPlan, setCurrentPlan] = useState(currentUserPlan);

  const handleMealDone = mealIndex => {
    const newMeals = [...currentPlan.foodPlan.meals];

    newMeals[mealIndex].done.push(moment().format());

    const newPlan = {
      ...currentPlan,
      updatedAt: moment().format(),
      foodPlan: {
        ...currentPlan.foodPlan,
        meals: newMeals
      }
    };

    DefaultFetch({
      url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/plan`,
      method: 'PUT',
      jsonBody: JSON.stringify(newPlan),
    })
      .then((data) => {
        if (data.error) setStatusMessage(data.error);

        if (data.modifiedCount === 0) {
          setStatusMessage('Sorry, it was not possible to update, please contact the support.');
          return;
        }

        setCurrentPlan(newPlan);
      })
      .finally(() => setProcessing(false))
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>
        <Grid.Container gap={0.5} justify="center">
          <Grid xs={12} justify="center">
            <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '7vw' }} weight="bold">
              {t('global_my_meals')}
            </Text>
          </Grid>
          <Grid xs={12} justify="center">
            <Text small color='gray'>
              {moment(currentPlan.createdAt).format('DD/MM/YYYY')} {t('global_to')} {moment(currentPlan.createdAt).add(currentPlan.lengthInWeeks, 'w').format('DD/MM/YYYY')}
            </Text>
            <Spacer x={0.3} />
            <Text small color='secondary'>
              ({currentPlan.lengthInWeeks} {t('global_weeks')})
            </Text>
          </Grid>
          <Grid xs={12} justify="center">
            <Progress striped value={(currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)} shadow size="xs" color="primary" status="warning" />
          </Grid>
          <Grid xs={12} justify="center">
            <Text small css={{ textAlign: 'center' }} color='gray'>
              {(currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)}% {t('global_complete')}
            </Text>
          </Grid>
          <Spacer y={1} />
        </Grid.Container>

        {currentPlan.foodPlan.meals.map((meal, index) => <>
          <Badge key={index} disableOutline isSquared content={`${t('global_time')} ${meal.time.replace('.', ':')}`} size="sm" placement="top-right" variant="bordered" horizontalOffset="5%" verticalOffset="-5%" color={!meal.done.find((doneDate) => moment(doneDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) ? 'primary' : 'success'}>
            <Card>
              <Card.Body>
                <Grid.Container>
                  <Grid xs={4} justify="center">
                    <Grid.Container>
                      <Grid xs={12} justify="center">
                        <div style={{ width: "80%" }}>
                          <CircularProgressbar
                            value={(meal.done.length / (currentPlan.lengthInWeeks * 7) * 100).toFixed(0)}
                            text={`${(meal.done.length / (currentPlan.lengthInWeeks * 7) * 100).toFixed(0)}%`}
                            strokeWidth={15}
                            styles={buildStyles({
                              backgroundColor: "#3e98c7",
                              textColor: "#fff",
                              pathColor: "#2abe0c",
                              trailColor: "#000",
                              textSize: "25px"
                            })}
                          />
                        </div>
                      </Grid>
                      <Spacer y={0.2} />
                      <Grid xs={12} justify="center">
                        <Text small color='gray'>
                          {meal.done.length} {t('global_of')} {(currentPlan.lengthInWeeks * 7)}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Grid xs={8} justify="left">
                    <Grid.Container gap={0}>
                      <Grid xs={12} justify="left">
                        <Text h1 css={{ textAlign: 'left', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '4.5vw' }} weight="bold">
                          {meal.title}
                        </Text>
                      </Grid>
                      <Grid xs={12} justify="left">
                        <Text h6 css={{ textAlign: 'left', fontSize: '3.5vw' }}>
                          {meal.ingredients}
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Grid>
                  <Spacer y={0.5} />
                  <Grid xs={12} justify="center">
                    <Text small css={{ textAlign: 'center', }} color='gray'> {meal.suggestion} </Text>
                  </Grid>
                  <Spacer y={0.8} />
                  {!meal.done.find((doneDate) => moment(doneDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) && <Grid xs={12} justify="center">
                    <Button auto size='xs' color={parseFloat(moment().format('H:MM')) > parseFloat(meal.time) ? 'warning' : 'primary'} onClick={() => handleMealDone(index)}>{t('global_done_today')}</Button>
                  </Grid>}
                </Grid.Container>
              </Card.Body>
            </Card>
          </Badge>
          <Spacer y={0.8} />
        </>
        )}

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)
  const userPlans = await findAll({ userId: session.user.id });
  const currentUserPlan = userPlans.find((plan) => !plan.terminatedAt);

  if (!currentUserPlan) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/planning/dashboard"
      }
    }
  }

  return {
    props: { ...translations, locale, currentUserPlan, session },
  }
}