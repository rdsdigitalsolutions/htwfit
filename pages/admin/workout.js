import Head from 'next/head'
import moment from 'moment';
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { Text, Grid, Card, Button, Progress, Spacer, Input, Link, Badge, Loading } from '@nextui-org/react';
import { FaPlay, FaAngleDoubleLeft, FaAngleDoubleRight, FaAward, FaGoogle, FaYoutube } from "react-icons/fa";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useStopwatch } from 'react-timer-hook';
import { useTheme } from '@nextui-org/react';
import NoSleep from "nosleep.js";

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { authOptions } from "./../api/auth/[...nextauth]"
import { findOne } from '../../repository/plan'
import Layout from '../../components/layout'
import LoadingPage from '../../components/loading-page'
import DefaultFetch from '../../lib/default-fetch'
import styles from '../../styles/Home.module.css'

export default function ComponentHandler({ locale, initialActivePlan }) {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();

  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const noSleep = new NoSleep();

  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const [currentPlans, setCurrentPlans] = useState(initialActivePlan);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [trainnings, setTrainnings] = useState([]);
  const [currentTrainning, setCurrentTrainning] = useState(null);
  const [currentExecutionIndex, setCurrentExecutionIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentRepetitionsStatus, setCurrentRepetitionsStatus] = useState(0);
  const [weightChange, setWeightChange] = useState(0);

  const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
  const totalRepetitionsStatus = selectedExercise ? selectedExercise.training.reduce((acc, curr) => acc + curr.repetitions.length, 0) : 0;
  const getLatestWeight = (currentTrainning) => currentTrainning.weight[(currentTrainning.weight.length ? (currentTrainning.weight.length - 1) : 0)] || 0;

  useEffect(() => {
    if (selectedExercise) {
      const current = [...selectedExercise.training]
      setCurrentTrainning({ ...current.shift() });
      setTrainnings([...current]);
    }
  }, [selectedExercise]);

  useEffect(() => {
    if (currentTrainning) {
      setWeightChange(getLatestWeight(currentTrainning))
    }
  }, [currentTrainning]);

  const handleReset = () => {
    setStatusMessage(null);
    setProcessing(false);
    setCurrentExecutionIndex(0);
    setIsResting(false);
    setRemainingTime(0);
    setIsDone(false);
  }

  const handleCurrentTrainning = ({ skip = false }) => {
    setProcessing(true);
    handleReset();

    if (trainnings.length) {
      let availableTrainnings = [...trainnings];
      const nextOne = availableTrainnings.shift();

      if (skip) {
        setCurrentRepetitionsStatus(currentRepetitionsStatus - currentExecutionIndex);
        availableTrainnings = [currentTrainning].concat(availableTrainnings);
      }

      setTrainnings(availableTrainnings ? availableTrainnings : []);
      setCurrentTrainning(nextOne);
    }
  }

  const handleCancellRoutine = () => {
    setProcessing(true);
    handleReset();
    setSelectedExercise(null);
    setTrainnings([]);
    setCurrentRepetitionsStatus(0);
    reset();
  }

  const handleTrainningConclusion = () => {
    setProcessing(true);
    handleCurrentTrainning({});

    if (getLatestWeight(currentTrainning) !== weightChange) {
      const newTrainning = { ...currentTrainning, weight: currentTrainning.weight.push(weightChange) };
      const allNewTrainnings = [...selectedExercise.training].map((training) => training.id === newTrainning.id ? newTrainning : training);
      const newSelectedExercise = { ...selectedExercise, training: [...allNewTrainnings] }
      const newCurrentPlans = { ...currentPlans };
      newCurrentPlans.exercises = newCurrentPlans.exercises.map((exercise) => exercise.id === newSelectedExercise.id ? newSelectedExercise : exercise);
      setCurrentPlans(newCurrentPlans);
    }

    if (!trainnings.length) {
      const newSelectedExercise = { ...selectedExercise }
      newSelectedExercise.done.push({ date: (new Date()).toISOString(), duration: minutes + (hours > 0 ? Number((hours / 60).toFixed(0)) : 0) });
      const newCurrentPlans = { ...currentPlans };
      newCurrentPlans.exercises = newCurrentPlans.exercises.map((exercise) => exercise.id === newSelectedExercise.id ? newSelectedExercise : exercise);
      newCurrentPlans.updatedAt = (new Date()).toISOString();

      DefaultFetch({
        url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/plan`,
        method: 'PUT',
        jsonBody: JSON.stringify(newCurrentPlans),
      })
        .then((data) => {
          if (data.error) setStatusMessage(data.error);

          pause();
          setCurrentPlans(newCurrentPlans);
          setIsDone(true);
        })
        .catch((e) => console.log(e.message))
        .finally(() => setProcessing(false))
    }
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true} loading={processing}>

        {processing && <>
          <Spacer y={12} />
          <LoadingPage style={{ backgroundColor: 'blue' }} text='Processing' />
        </>}

        {!processing && <>
          {selectedExercise && <Grid.Container gap={0.5} justify="right">
            <Spacer y={0.7} />

            {!isDone && <>
              <Grid xs={12} justify="center">
                <Text h5 color='gray'>
                  {selectedExercise.title}
                </Text>
              </Grid>

              <Grid xs={12} justify="center">
                <Progress striped value={((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)} shadow size="md" color="primary" status="warning" />
              </Grid>

              <Grid xs={12} justify="center">
                <Text small>
                  {((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)}% {t('global_in')} <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
                </Text>
              </Grid>

              <Spacer y={0.7} />
            </>}

            <Grid xs={12} justify="center">

              {isDone && <>
                <Grid.Container>
                  <Grid xs={12} justify="center">
                    <Button auto shadow size="sm" color='primary' onClick={() => handleCancellRoutine()}>
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
                                        value={((Number((currentPlans.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlans.lengthInWeeks * 7) * currentPlans.foodPlan.meals.length) * 100).toFixed(0)) + currentPlans.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (currentPlans.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (currentPlans.exercises.length + 1)).toFixed(0)}
                                        text={`${((Number((currentPlans.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlans.lengthInWeeks * 7) * currentPlans.foodPlan.meals.length) * 100).toFixed(0)) + currentPlans.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (currentPlans.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (currentPlans.exercises.length + 1)).toFixed(0)}%`}
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
                                  <Grid xs={12} justify="center">
                                    <Spacer y={8} />
                                  </Grid>
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

              {!isDone && !currentTrainning && <Card>
                <Card.Body>
                  <Grid.Container>
                    <Grid xs={12} justify="center">
                      <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '6vw', lineHeight: 'normal' }} weight="bold">
                        Well Done, routine finished!
                      </Text>
                    </Grid>
                  </Grid.Container>
                </Card.Body>
              </Card>}

              {!isDone && currentTrainning && <>

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
                          <Button auto shadow size="md" color='success' onClick={() => handleTrainningConclusion()}>
                            {currentRepetitionsStatus === totalRepetitionsStatus ? t('global_conclude') : t('global_start_next')} <Spacer x={0.5} /> <FaAngleDoubleRight />
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
                                <Grid xs={12} justify="left">
                                  <Text h6 css={{ textAlign: 'left' }} color="gray">
                                    {currentTrainning.observations}
                                  </Text>
                                </Grid>
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
                                      strokeWidth={8}
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
                                        return <Button auto shadow size="md" disabled={isResting} color='primary' onClick={() => setIsResting(true)} role="timer" aria-live="assertive">
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
                            <Grid xs={5} justify="center">
                              {weightChange > 0 && <>
                                <Grid.Container gap={0} >
                                  <Grid xs={12} justify="center">
                                    <Text h2>{weightChange}kg</Text>
                                  </Grid>
                                  <Grid xs={12} justify="center">
                                    <Text small color='gray'>{t('global_initial_weight')}</Text>
                                  </Grid>
                                </Grid.Container>
                              </>}
                            </Grid>

                            <Grid xs={6} justify="center">
                              <Grid.Container gap={0} >
                                <Grid xs={12} justify="right">
                                  <Text h6 color='primary'>
                                    {t('global_number_of_repetitions')}
                                  </Text>
                                </Grid>
                                <Grid xs={12} justify="right">
                                  {currentTrainning.repetitions.map((repetition, index) => <Text key={index} className={index === currentExecutionIndex && !isResting ? styles.blobYellow : styles.blob}>{repetition}</Text>)}
                                </Grid>
                              </Grid.Container>
                            </Grid>
                          </Grid.Container>
                        </Card.Body>
                      </Card>
                    </Grid>

                    {trainnings[0] && <>
                      <Spacer y={0.5} />
                      <Grid xs={12} justify="center">
                        <Card>
                          <Card.Body>
                            <Grid.Container>
                              <Grid xs={4} justify="right">
                                <Text small color='gray'>{t('global_next_exercise')}:</Text>
                              </Grid>
                              <Grid xs={8} justify="center">
                                <Text small color='warning'>{trainnings[0].title}</Text>
                              </Grid>
                            </Grid.Container>
                          </Card.Body>
                        </Card>
                      </Grid>
                    </>}

                  </Grid.Container>
                </>}
              </>}

            </Grid>

            {!isDone && currentTrainning && (currentExecutionIndex + 1) <= currentTrainning.repetitions.length && <>
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

          </Grid.Container>}




          {!selectedExercise && <>
            <Spacer y={1} />
            <Grid.Container gap={0} justify="center">
              <Grid xs={12} justify="center">
                <Text h4 css={{ textAlign: 'center', textGradient: "45deg, $blue600 -20%, $pink600 50%", lineHeight: 'normal' }}>
                  {currentPlans.goal}
                </Text>
              </Grid>

              <Grid xs={12} justify="center">
                <Text h6 color='gray' css={{ textAlign: 'center' }}>
                  {currentPlans.observations}
                </Text>
              </Grid>
            </Grid.Container>

            <Spacer y={1} />
            {(currentPlans.exercises || []).map((exercise, index) => <>

              <Badge key={index} disableOutline isSquared content={`${(exercise.done.reduce((acc, curr) => acc + (curr.duration || 0), 0) / (exercise.done.length || 1)).toFixed(0)}min ${t('global_duration')} `} size="sm" placement="top-right" variant="bordered" horizontalOffset="10%" verticalOffset="-5%" color='primary'>
                <Card>
                  <Card.Body>
                    <Grid.Container>
                      <Grid xs={4} justify="center">
                        <Grid.Container>
                          <Grid xs={12} justify="center">
                            <div style={{ width: "80%" }}>
                              <CircularProgressbar
                                value={(exercise.done.length / (currentPlans.lengthInWeeks * exercise.days.length) * 100).toFixed(0)}
                                text={`${(exercise.done.length / (currentPlans.lengthInWeeks * exercise.days.length) * 100).toFixed(0)}%`}
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
                              {t('global_done')} {exercise.done.length} {t('global_of')} {(currentPlans.lengthInWeeks * exercise.days.length)}
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
                      {exercise.done.length < (currentPlans.lengthInWeeks * exercise.days.length) && <>
                        <Grid xs={12} justify="center">
                          <Button auto type="submit" color={exercise.days.find(dayOfWeek => dayOfWeek === (new Date()).getDay()) ? 'primary' : 'gray'} onClick={() => { setSelectedExercise(exercise); start(); noSleep.enable(); }}>
                            {exercise.days.map(dayOfWeek => t(`global_${weekday[dayOfWeek]}`)).join(' / ')} <Spacer x={0.5} /> <FaPlay />
                          </Button>
                        </Grid>
                      </>}
                    </Grid.Container>
                  </Card.Body>
                </Card>
              </Badge>
              <Spacer y={0.8} />

            </>)}

          </>}
        </>}

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)
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
