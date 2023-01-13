import Head from 'next/head'
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { Text, Grid, Card, Button, Progress, Spacer, Input, Link, Switch, Loading, Badge } from '@nextui-org/react';
import { FaPlay, FaAngleDoubleLeft, FaAngleDoubleRight, FaAward, FaGoogle, FaYoutube } from "react-icons/fa";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useStopwatch } from 'react-timer-hook';
import { useTheme } from '@nextui-org/react';
import NoSleep from "nosleep.js";
import confetti from 'canvas-confetti';

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { authOptions } from "../../api/auth/[...nextauth]"
import { findOne } from '../../../repository/plan'
import Layout from '../../../components/layout'
import DefaultFetch from '../../../lib/default-fetch'
import styles from '../../../styles/Home.module.css'

export default function ComponentHandler({ locale, initialActivePlan }) {
  const { t } = useTranslation('common');
  const router = useRouter()
  const { id } = router.query
  const { isDark } = useTheme();

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [celebratedMidTrainning, setCelebratedMidTrainning] = useState(false);


  const [activePlan, setActivePlan] = useState(initialActivePlan);
  const [selectedExercise, setSelectedExercise] = useState(activePlan.exercises.find((exercise) => exercise.id === id));
  const [activeTrainnings, setActiveTrainnings] = useState(selectedExercise.training.filter((training) => !training.done.find((date) => moment(date).format('DD/MM/YYY') === moment().format('DD/MM/YYY'))));
  const [currentTrainning, setCurrentTrainning] = useState(activeTrainnings[0]);
  const [availableTrainnings, setAvailableTrainnings] = useState(activeTrainnings.length > 1 ? activeTrainnings.slice(1, activeTrainnings.length) : []);
  const [currentExecutionIndex, setCurrentExecutionIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentRepetitionsStatus, setCurrentRepetitionsStatus] = useState(0);
  const [weightChange, setWeightChange] = useState(0);
  const [keepAlive, setKeepAlive] = useState(false);

  const { seconds, minutes, hours, pause, reset } = useStopwatch({ autoStart: true, offsetTimestamp: (new Date()).setSeconds((new Date()).getSeconds() + (activePlan.ongoingSession && moment(activePlan.ongoingSession.date).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY') ? activePlan.ongoingSession.elapsedTimeInSeconds : 0)) });
  const totalRepetitionsStatus = activeTrainnings.reduce((acc, curr) => acc + curr.repetitions.length, 0);
  const getLatestWeight = (currentTrainning) => currentTrainning.weight[(currentTrainning.weight.length ? (currentTrainning.weight.length - 1) : 0)] || 0;

  useEffect(() => {
    if (currentTrainning) {
      setWeightChange(getLatestWeight(currentTrainning))
    }
  }, [currentTrainning]);

  const handleKeepAlive = () => {
    const noSleep = new NoSleep();
    noSleep.enable();
    setKeepAlive(true);
  }

  const handleReset = () => {
    setStatusMessage(null);
    setProcessing(false);
    setCurrentExecutionIndex(0);
    setIsResting(false);
    setRemainingTime(0);
  }

  const handleCurrentTrainning = ({ skip = false }) => {
    handleReset();
    let newAvailableTrainnings = [...availableTrainnings];

    if (availableTrainnings.length) {
      const nextOne = newAvailableTrainnings.shift();

      if (skip) {
        setCurrentRepetitionsStatus(currentRepetitionsStatus - currentExecutionIndex);
        newAvailableTrainnings = [currentTrainning].concat(availableTrainnings);
      }

      setAvailableTrainnings(newAvailableTrainnings);
      setCurrentTrainning(nextOne);
    } else {
      console.log('availableTrainnings:', availableTrainnings)
    }
  }

  const handleCancellRoutine = () => {
    handleReset();

    if (!activePlan.ongoingSession) {
      router.push('/admin/workout');
      return;
    }

    const newPlan = { ...activePlan };
    newPlan.ongoingSession = null;

    setProcessing(true);
    DefaultFetch({
      url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/plan`,
      method: 'PUT',
      jsonBody: JSON.stringify(newPlan),
    })
      .then((data) => {
        if (data.error) setStatusMessage(data.error);
        router.push('/admin/workout');
      })
      .catch((e) => console.log(e.message))
      .finally(() => setProcessing(false))
  }

  const handleTrainningConclusion = () => {
    handleCurrentTrainning({});

    const newTrainning = {
      ...currentTrainning,
      ...(currentTrainning.weight[currentTrainning.weight.length - 1] !== weightChange && { weight: [...currentTrainning.weight, weightChange] }),
      done: [...currentTrainning.done, moment().format()],
    };
    const allNewTrainnings = [...selectedExercise.training].map((training) => training.id === newTrainning.id ? newTrainning : training);
    const newSelectedExercise = { ...selectedExercise, training: [...allNewTrainnings] }
    const newActivePlan = { ...activePlan };

    newActivePlan.ongoingSession = {
      elapsedTimeInSeconds: (minutes + (hours > 0 ? Number((hours / 60).toFixed(0)) : 0) || 0) * 60,
      date: moment().format()
    };

    if (!availableTrainnings.length) {
      newSelectedExercise.done.push({ date: moment().format(), duration: minutes + (hours > 0 ? Number((hours / 60).toFixed(0)) : 0) });
      newActivePlan.ongoingSession = null;
    }

    newActivePlan.exercises = newActivePlan.exercises.map((exercise) => exercise.id === newSelectedExercise.id ? newSelectedExercise : exercise);
    newActivePlan.updatedAt = (new Date()).toISOString();

    setProcessing(true);
    DefaultFetch({
      url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/plan`,
      method: 'PUT',
      jsonBody: JSON.stringify(newActivePlan),
    })
      .then((data) => {
        if (data.error) setStatusMessage(data.error);

        setActivePlan(newActivePlan);

        if (!availableTrainnings.length) {
          pause();
          setCurrentTrainning(null);
          setProcessing(false);
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 1 },
            gravity: 0.7,
          });
        }
      }).then(() => {
        if (!celebratedMidTrainning && ((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0) >= 50) {
          setCelebratedMidTrainning(true);
          setProcessing(false);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 1 },
            gravity: 0.7,
          });
        }
      })
      .catch((e) => console.log(e.message))
      .finally(() => setProcessing(false))
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true} loading={processing}>
        <Grid.Container gap={0.5} justify="right">
          <Spacer y={0.7} />

          {!currentTrainning && <>
            <Grid.Container>
              <Grid xs={12} justify="center">
                <Button auto shadow size="sm" color='primary' onClick={() => { setProcessing(true); router.push('/admin/workout'); }}>
                  {t('global_return_exercises')}
                </Button>
              </Grid>

              <Spacer y={1} />

              <Grid xs={12} justify="center">
                <Card>
                  <Card.Body>
                    <Grid.Container>
                      <Grid xs={12} justify="center">

                        <Grid.Container>
                          <Grid xs={4} justify="center">

                            <Grid.Container>
                              <Grid xs={12} justify="center">
                                <div style={{ width: "80%" }}>
                                  <CircularProgressbar
                                    value={((Number((activePlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((activePlan.lengthInWeeks * 7) * activePlan.foodPlan.meals.length) * 100).toFixed(0)) + activePlan.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (activePlan.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (activePlan.exercises.length + 1)).toFixed(0)}
                                    text={`${((Number((activePlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((activePlan.lengthInWeeks * 7) * activePlan.foodPlan.meals.length) * 100).toFixed(0)) + activePlan.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (activePlan.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (activePlan.exercises.length + 1)).toFixed(0)}%`}
                                    strokeWidth={15}
                                    styles={buildStyles({
                                      backgroundColor: "#3e98c7",
                                      textColor: isDark ? '#c6c6c6' : '#000',
                                      pathColor: "#2abe0c",
                                      trailColor: isDark ? '#000' : '#f3f3f4',
                                      textSize: "25px"
                                    })}
                                  />
                                </div>
                              </Grid>
                              <Grid xs={12} justify="center">
                                <Text small color='gray'>
                                  {t('global_workout_plan')}
                                </Text>
                              </Grid>
                            </Grid.Container>
                          </Grid>
                          <Grid xs={8} justify="left">
                            <Grid.Container>
                              <Grid xs={12} justify="center">
                                <Text small color='gray'>
                                  {t(`global_${weekday[moment().format('d')]}`)} {moment().format('DD/MM/YYYY')}
                                </Text>
                              </Grid>
                              <Grid xs={12} justify="center">
                                <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '13vw', lineHeight: 'normal' }} weight="bold">
                                  DONE!
                                </Text>
                              </Grid>
                              <Grid xs={12} justify="center">
                                <Text h6>
                                  {selectedExercise.title}
                                </Text>
                              </Grid>
                            </Grid.Container>
                          </Grid>
                        </Grid.Container>
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>

              <Spacer y={0.3} />

              <Grid xs={12} justify="center">
                <Card>
                  <Card.Body>
                    <Grid.Container>
                      <Grid xs={12} justify="center">
                        <Text h6 css={{ textAlign: 'center' }} color='gray'>
                          {t('global_inspire')}:
                        </Text>
                      </Grid>
                      <Grid xs={12} justify="center">
                        <Card variant="bordered">
                          <Card.Body>
                            <Grid.Container>
                              <Grid xs={12} justify="center" css={{ minHeight: '30vh' }}></Grid>
                            </Grid.Container>
                          </Card.Body>
                        </Card>
                      </Grid>
                      <Spacer y={0.5} />
                      <Grid xs={12} justify="center">
                        <Text small css={{ textAlign: 'center' }} color='gray'>
                          {t('global_printscreen')}.
                        </Text>
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid.Container>
          </>}

          {currentTrainning && <>

            <Grid xs={12} justify="center">
              <Text h6 color='gray'>Keep Screen unloked</Text><Spacer x={0.3} /> <Switch size="xs" checked={keepAlive} onClick={handleKeepAlive} />
            </Grid>

            <Grid xs={12} justify="center">
              <Progress striped value={((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)} shadow size="md" color="primary" status="warning" />
            </Grid>

            <Grid xs={12} justify="center">
              <Text h5 color='gray'>
                {selectedExercise.title}
              </Text>
            </Grid>

            <Grid xs={12} justify="center">
              <Text css={{ fontSize: celebratedMidTrainning ? '20px' : '12px' }} color={celebratedMidTrainning ? 'warning' : 'gray'}>
              {t('global_done')} {((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)}% {t('global_in')} <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
              </Text>
            </Grid>

            <Spacer y={0.7} />

            <Grid xs={12} justify="center">

              {(currentExecutionIndex + 1) > currentTrainning.repetitions.length && <>
                <Card>
                  <Card.Body>
                    <Grid.Container gap={0} >
                      <Grid xs={12} justify="center">
                        <Spacer x={1} />
                        <FaAward size={80} />
                        <Spacer x={0.8} />
                        <Text h3 css={{ textAlign: 'center' }} weight="bold">
                          {t('global_congrats_exercise_done')}.
                        </Text>
                      </Grid>

                      <Spacer y={1} />

                      <Grid xs={12} justify="center">
                        <Input
                          size="md"
                          fullWidth={true}
                          type="text"
                          bordered
                          initialValue={weightChange || 0}
                          value={weightChange || 0}
                          label={t('global_adjust_weight')}
                          onChange={(e) => setWeightChange(parseFloat(e.target.value))}
                        />
                      </Grid>

                      <Spacer y={2} />

                      <Grid xs={12} justify="center">
                        <Button auto shadow size="md" color={currentRepetitionsStatus === totalRepetitionsStatus ? 'success' : 'primary'} onClick={handleTrainningConclusion}>
                          {currentRepetitionsStatus === totalRepetitionsStatus ? t('global_conclude') : t('global_start_next')}
                        </Button>
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </>}

              {(currentExecutionIndex + 1) <= currentTrainning.repetitions.length && seconds < 8 && minutes === 0 && hours === 0 && <>
                <Card variant="bordered">
                  <Spacer y={2} />
                  <Grid xs={12} justify="center">
                    <Text h3 css={{ textAlign: 'center' }} color='warning'>
                      {t('global_execute_instruction')}.
                    </Text>
                  </Grid>
                  <Grid xs={12} justify="center">
                    <Loading type="points" />
                  </Grid>
                  <Spacer y={2} />
                </Card>
              </>}

              {(currentExecutionIndex + 1) <= currentTrainning.repetitions.length && (seconds > 8 || minutes > 0 || hours > 0) && <>
                <Grid.Container gap={0} >

                  <Grid xs={12} justify="center">
                    <Card>
                      <Card.Body>

                        <Grid.Container gap={0} >
                          <Grid xs={12} justify="center">
                            <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '7vw', lineHeight: 'normal' }} weight="bold">
                              {currentTrainning.title}
                            </Text>
                          </Grid>

                          <Grid xs={8} justify="left">
                            <Grid.Container gap={0} >
                              {currentTrainning.observations && <Grid xs={12} justify="left">
                                <Text h6 css={{ textAlign: 'left' }} color="gray">
                                  {currentTrainning.observations}
                                </Text>
                              </Grid>}
                              <Grid xs={12} justify="center">
                                <Link href={`https://www.google.com/search?tbm=isch&q=${currentTrainning.title}`} target='_blank'>
                                  <Button auto size='sm' shadow color='primary'><FaGoogle /></Button>
                                </Link>
                                <Spacer x={0.5} />
                                <Link href={`http://www.youtube.com/results?search_query=${currentTrainning.title}`} target='_blank'>
                                  <Button auto size='sm' shadow color='primary'><FaYoutube /></Button>
                                </Link>
                              </Grid>
                            </Grid.Container>

                          </Grid>
                          <Grid xs={4} justify="center">
                            <Grid.Container gap={0} >
                              <Grid xs={12} justify="center">
                                {(currentExecutionIndex + 1) <= currentTrainning.repetitions.length && <>
                                  <CountdownCircleTimer
                                    size='110'
                                    key={currentExecutionIndex}
                                    isPlaying={isResting}
                                    strokeWidth={14}
                                    duration={currentTrainning.restPause}
                                    trailColor={isDark ? '#000' : '#c6c6c6'}
                                    isSmoothColorTransition={true}
                                    colors={['#0072f6', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[
                                      currentTrainning.restPause,
                                      currentTrainning.restPause / 2,
                                      currentTrainning.restPause / 4,
                                      0,
                                    ]}
                                    onComplete={() => {
                                      setIsResting(false);
                                      setCurrentExecutionIndex(currentExecutionIndex + 1);
                                      setCurrentRepetitionsStatus(currentRepetitionsStatus + 1);
                                      return { shouldRepeat: false }
                                    }}
                                  >
                                    {({ remainingTime }) => {
                                      if (remainingTime < currentTrainning.restPause) setRemainingTime(remainingTime);
                                      return <Button auto shadow size="lg" disabled={isResting} color='primary' onClick={() => setIsResting(true)} role="timer" aria-live="assertive">
                                        {remainingTime !== currentTrainning.restPause ? `${remainingTime}s` : <FaPlay />}
                                      </Button>
                                    }}
                                  </CountdownCircleTimer>
                                </>}
                              </Grid>

                              <Grid xs={12} justify="center">
                                <Text small color='gray'>{t('global_stopwatch')}</Text>
                              </Grid>
                            </Grid.Container>
                          </Grid>

                        </Grid.Container>

                      </Card.Body>
                    </Card>
                  </Grid>

                  <Spacer y={0.5} />
                  <Grid xs={12} justify="center">
                    <Card>
                      <Card.Body>
                        <Grid.Container gap={0} >
                          {weightChange > 0 && <>
                            <Grid xs={4} justify="center">
                              <Grid.Container gap={0} >
                                <Grid xs={12} justify="center">
                                  <Text h2>{weightChange}kg</Text>
                                </Grid>
                                <Grid xs={12} justify="center">
                                  <Text small color='gray'>{t('global_initial_weight')}</Text>
                                </Grid>
                              </Grid.Container>
                            </Grid>
                          </>}

                          <Grid xs={weightChange ? 7 : 12} justify={weightChange ? 'center' : 'center'}>
                            <Grid.Container gap={0} >

                              {remainingTime <= 0 && <>
                                <Grid xs={12} justify={weightChange ? 'right' : 'center'}>
                                  <Text h6 color='primary'>
                                    {t('global_number_of_repetitions')}
                                  </Text>
                                </Grid>
                                <Grid xs={12} justify={weightChange ? 'right' : 'center'}>
                                  {currentTrainning.repetitions.map((repetition, index) => <Text key={index} className={index === currentExecutionIndex && !isResting ? styles.blobYellow : styles.blob}>{repetition}</Text>)}
                                </Grid>
                              </>}

                              {remainingTime > 0 && <>
                                <Grid xs={12} justify={weightChange ? 'right' : 'center'} css={{ margin: '10px 0 0 10px', textAlign: 'center' }}>
                                  {remainingTime < currentTrainning.restPause && remainingTime > (currentTrainning.restPause / 4) && <Text h5 color='success'>{t('global_rest')}</Text>}
                                  {remainingTime < (currentTrainning.restPause / 6) && <Text h5 color='warning'>{t('global_get_ready')}</Text>}
                                </Grid>
                              </>}

                            </Grid.Container>
                          </Grid>

                        </Grid.Container>
                      </Card.Body>
                    </Card>
                  </Grid>

                  {availableTrainnings.length > 0 && <>
                    <Spacer y={0.5} />
                    <Grid xs={12} justify="center">
                      <Card>
                        <Card.Body>
                          <Grid.Container>
                            <Grid xs={4} justify="right">
                              <Text small color='gray'>{t('global_next_exercise')}:</Text>
                            </Grid>
                            <Grid xs={6} justify="right">
                              <Link href={`https://www.google.com/search?tbm=isch&q=${availableTrainnings[0].title}`} target='_blank'>
                                <Text small color='warning' weight="bold">{availableTrainnings[0].title}</Text>
                              </Link>
                            </Grid>
                            <Grid xs={2} justify="center">
                              {availableTrainnings[0].weight.length && <Text small color='gray'>{availableTrainnings[0].weight[availableTrainnings[0].weight.length - 1]}kg</Text>}
                            </Grid>
                          </Grid.Container>
                        </Card.Body>
                      </Card>
                    </Grid>
                  </>}

                </Grid.Container>
              </>}

            </Grid>

            {(currentExecutionIndex + 1) <= currentTrainning.repetitions.length && <>
              <Spacer y={1} />

              <Grid xs={12} justify="center">
                <Button auto flat size="sm" color='error' onClick={() => handleCancellRoutine(null)}>
                  <FaAngleDoubleLeft /><Spacer x={0.5} /> {t('global_cancell_routine')}
                </Button>

                <Spacer x={0.5} />

                <Button auto flat size="sm" color='primary' onClick={() => handleCurrentTrainning({ skip: true })}>
                  {t('global_skip')} <Spacer x={0.5} /> <FaAngleDoubleRight />
                </Button>
              </Grid>
            </>}


          </>}

        </Grid.Container>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return { redirect: { permanent: false, destination: "/" } }
  }

  const initialActivePlan = await findOne({ userId: session.user.id });

  if (!initialActivePlan || initialActivePlan.terminatedAt) {
    return { redirect: { permanent: false, destination: "/admin/planning/dashboard" } }
  }

  return {
    props: { ...translations, locale, initialActivePlan },
  }
}
