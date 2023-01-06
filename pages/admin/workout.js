import Head from 'next/head'
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { unstable_getServerSession } from "next-auth/next"
import { useTranslation } from 'next-i18next'
import { Text, Grid, Card, Button, Progress, Spacer, Input, Link, Badge } from '@nextui-org/react';
import { FaPlay, FaAngleDoubleLeft, FaAngleDoubleRight, FaAward, FaSearch, FaCheck, FaGoogle, FaYoutube } from "react-icons/fa";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useStopwatch } from 'react-timer-hook';

import { authOptions } from "./../api/auth/[...nextauth]"
import { findOne } from '../../repository/plan'
import Layout from '../../components/layout'
import LoadingPage from '../../components/loading-page'
import DefaultFetch from '../../lib/default-fetch'
import styles from '../../styles/Home.module.css'

export default function ComponentHandler({ locale, initialActivePlan }) {
  const { t } = useTranslation('common');
  const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  const [weightChange, setWeightChange] = useState(null);

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
    handleReset();
    setSelectedExercise(null);
    setTrainnings([]);
    setCurrentRepetitionsStatus(0);
    reset();
  }

  const handleTrainningConclusion = () => {
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

      setProcessing(true);

      DefaultFetch({
        url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/plan`,
        method: 'PUT',
        jsonBody: JSON.stringify(newCurrentPlans),
      })
        .then((data) => {
          if (data.error) setStatusMessage(data.error);
          setCurrentPlans(newCurrentPlans);
          setIsDone(true);
          pause();
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

      <Layout locale={locale} restricted={true}>

        {processing && <>
          <Spacer y={12} />
          <LoadingPage style={{ backgroundColor: 'blue' }} text='Processing' />
        </>}

        {!processing && <>
          {selectedExercise && <Grid.Container gap={0.5} justify="right">
            <Spacer y={0.7} />

            <Grid xs={12} justify="center">
              <Text h5 color='gray'>
                {selectedExercise.title}
              </Text>
            </Grid>

            <Grid xs={12} justify="center">
              <Progress striped value={((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)} shadow size="xs" color="primary" status="warning" />
            </Grid>

            <Grid xs={12} justify="center">
              <Text small>
                {((currentRepetitionsStatus / totalRepetitionsStatus) * 100).toFixed(0)}% in <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
              </Text>
            </Grid>

            <Spacer y={0.7} />

            <Grid xs={12} justify="center">


              {isDone && <>
                <Grid.Container>
                  <Grid xs={12} justify="center">
                    <Card>
                      <Card.Body>
                        <Grid.Container>
                          <Grid xs={12} justify="center">
                            <Text h6>
                              Todays' training is
                            </Text>
                          </Grid>
                          <Grid xs={12} justify="center">
                            <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '13vw' }} weight="bold">
                              DONE!
                            </Text>
                          </Grid>
                          <Grid xs={12} justify="center">
                            <Text h6 css={{ textAlign: 'center' }} color='gray'>
                              Inspire others, share your achievements with your personalized message:
                            </Text>
                          </Grid>
                          <Grid xs={12} justify="center">
                            <Card variant="bordered">
                              <Card.Body>
                                <Grid.Container>
                                  <Grid xs={12} justify="center">
                                    <Spacer y={10} />
                                  </Grid>
                                </Grid.Container>
                              </Card.Body>
                            </Card>
                          </Grid>
                          <Spacer y={0.5} />
                          <Grid xs={12} justify="center">
                            <Text small css={{ textAlign: 'center' }} color='gray'>
                              Take a printscreen and share on your preferred social media.
                            </Text>
                          </Grid>
                        </Grid.Container>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Spacer y={1.5} />
                  <Grid xs={12} justify="center">
                    <Button auto bordered size="sm" color='primary' onClick={() => handleCancellRoutine()}>
                      Return to exercises
                    </Button>
                  </Grid>
                </Grid.Container>
              </>}

              {!isDone && !currentTrainning && <Card>
                <Card.Body>
                  <Grid.Container>
                    <Grid xs={12} justify="center">
                      <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '6vw' }} weight="bold">
                        Well Done, routine finished!
                      </Text>
                    </Grid>
                  </Grid.Container>
                </Card.Body>
              </Card>}

              {!isDone && currentTrainning && <Card>

                <Card.Header>
                  <Grid.Container>
                    <Grid xs={12} justify="center">
                      <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '6vw' }} weight="bold">
                        {currentTrainning.title}
                      </Text>
                    </Grid>
                    <Grid xs={12} justify="center">
                      <Text h6 css={{ textAlign: 'center' }} color="gray">
                        {currentTrainning.observations}
                      </Text>
                    </Grid>
                    <Grid xs={12} justify="center">
                      <Link href={`https://www.google.com/search?tbm=isch&q=${currentTrainning.title}`} target='_blank'>
                        <Button auto size='xs' bordered color='primary'><FaGoogle /></Button>
                      </Link>
                      <Spacer x={0.5} />
                      <Link href={`http://www.youtube.com/results?search_query=${currentTrainning.title}`} target='_blank'>
                        <Button auto size='xs' bordered color='primary'><FaYoutube /></Button>
                      </Link>
                    </Grid>
                  </Grid.Container>
                </Card.Header>

                <Card.Body>


                  {(currentExecutionIndex + 1) <= currentTrainning.repetitions.length && <Grid.Container>

                    {(seconds > 10 || minutes > 0 || hours > 0) && <Grid xs={12} justify="center">
                      <CountdownCircleTimer
                        key={currentExecutionIndex}
                        isPlaying={isResting}
                        strokeWidth={30}
                        duration={currentTrainning.restPause}
                        colors={['#20436f', '#F7B801', '#A30000', '#A30000']}
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
                          return <Button auto flat size="xl" disabled={isResting} color='primary' onClick={() => setIsResting(true)}>
                            {remainingTime !== currentTrainning.restPause ? `${remainingTime}s` : <FaPlay />}
                          </Button>
                        }}
                      </CountdownCircleTimer>
                    </Grid>}

                    {seconds < 10 && minutes === 0 && hours === 0 && <>
                      <Card variant="bordered">
                        <Grid xs={12} justify="center">
                          <Text h1 css={{ textAlign: 'center' }} weight="bold" color='primary'>
                            Welcome
                          </Text>
                        </Grid>
                        <Grid xs={12} justify="center">
                          <Text h5 css={{ textAlign: 'center' }} color='gray'>
                            Please execute the first repetition. Once done, start the resting pause.
                          </Text>
                        </Grid>
                      </Card>

                    </>}

                    <Spacer y={1} />

                    <Grid xs={12} justify="center">
                      <Text h6 color='gray'>
                        Number of Repetitions
                      </Text>
                    </Grid>

                    <Grid xs={12} justify="center">
                      {currentTrainning.repetitions.map((repetition, index) => <Text key={index} className={index === currentExecutionIndex && !isResting ? styles.blobYellow : styles.blob}>{repetition}</Text>)}
                    </Grid>

                    {weightChange > 0 && <>
                      <Spacer y={0.5} />
                      <Grid xs={12} justify="center">
                        <Badge isSquared color='warning' variant="bordered">Initial weight is:<Spacer x={0.2} /> {weightChange}kg</Badge>
                      </Grid>
                    </>}


                  </Grid.Container>}

                  {(currentExecutionIndex + 1) > currentTrainning.repetitions.length && <Grid.Container>
                    <Grid xs={12} justify="center">
                      <Spacer x={1} />
                      <FaAward size={80} />
                      <Spacer x={0.8} />
                      <Text h3 css={{ textAlign: 'left' }} weight="bold">
                        Congratulations, exercise done.
                      </Text>
                    </Grid>

                    <Spacer y={3} />

                    <Grid xs={12} justify="center">
                      <Input
                        size="md"
                        fullWidth={true}
                        type="text"
                        bordered
                        initialValue={weightChange || 0}
                        value={weightChange || 0}
                        labelPlaceholder={t('Adjust the weight for the next session')}
                        onChange={(e) => setWeightChange(parseFloat(e.target.value))}
                      />
                    </Grid>

                    <Spacer y={1} />

                    <Grid xs={12} justify="center">
                      <Button auto bordered size="md" color='success' onClick={() => handleTrainningConclusion()}>
                        {currentRepetitionsStatus === totalRepetitionsStatus ? 'Conclude Routine' : 'Start Next'} <Spacer x={0.5} /> <FaAngleDoubleRight />
                      </Button>
                    </Grid>
                  </Grid.Container>}


                </Card.Body>
              </Card>}

            </Grid>

            {!isDone && currentTrainning && (currentExecutionIndex + 1) <= currentTrainning.repetitions.length && <>

              <Spacer y={1} />

              <Grid xs={12} justify="center">
                {remainingTime > 0 && remainingTime < (currentTrainning.restPause / 4) && <Badge isSquared variant="bordered" color='warning'>
                  Get ready to start again please.
                </Badge>}
                {remainingTime > (currentTrainning.restPause / 4) && <Badge isSquared variant="bordered" color='success'>
                  It is time to rest, relax and wait.
                </Badge>}
              </Grid>

              <Spacer y={1} />

              <Grid xs={12} justify="center">
                <Button auto bordered size="sm" color='error' onClick={() => handleCancellRoutine(null)}>
                  <FaAngleDoubleLeft /><Spacer x={0.5} /> Cancell Routine
                </Button>

                <Spacer x={0.5} />

                <Button auto bordered size="sm" color='warning' onClick={() => handleCurrentTrainning({ skip: true })}>
                  Skip for now <Spacer x={0.5} /> <FaAngleDoubleRight />
                </Button>
              </Grid>
            </>}

          </Grid.Container>}




          {!selectedExercise && <>

            <Grid.Container gap={0} justify="center">
              <Grid xs={12} justify="center">
                <Text h4 css={{ textAlign: 'center', textGradient: "45deg, $blue600 -20%, $pink600 50%" }}>
                  {currentPlans.goal}
                </Text>
              </Grid>

              <Grid xs={12} justify="center">
                <Text h6 color='gray' css={{ textAlign: 'center' }}>
                  {currentPlans.observations}
                </Text>
              </Grid>
            </Grid.Container>

            <Grid.Container gap={0.8} justify="center">
              {(currentPlans.exercises || []).map((exercise, index) => <Grid xs={12} key={index}>

                <Card>
                  <Card.Body >

                    <Grid.Container>

                      <Grid xs={12} justify="center">
                        <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '5vw' }} weight="bold">
                          {exercise.title}
                        </Text>
                      </Grid>

                      <Grid xs={12} justify="center">
                        <Progress striped value={((exercise.done.length / (currentPlans.lengthInWeeks * exercise.days.length)) * 100).toFixed(0)} shadow size="xs" color="primary" status="warning" />
                      </Grid>

                      <Spacer y={0.2} />

                      <Grid xs={12} justify="center">
                        <Text h6 color='gray'>
                          {((exercise.done.length / (currentPlans.lengthInWeeks * exercise.days.length)) * 100).toFixed(0)}% complete.
                        </Text>
                      </Grid>

                      {exercise.done.length < (currentPlans.lengthInWeeks * exercise.days.length) && <>

                        <Grid xs={12} justify="center">
                          <Button auto type="submit" color={exercise.days.find(dayOfWeek => dayOfWeek === (new Date()).getDay()) ? 'primary' : 'gray'} onClick={() => { setSelectedExercise(exercise); start(); }}>
                            {exercise.days.map(dayOfWeek => weekday[dayOfWeek]).join(' / ')} <Spacer x={0.5} /> <FaPlay />
                          </Button>
                        </Grid>
                      </>}

                    </Grid.Container>

                  </Card.Body>
                </Card>

              </Grid>)}

            </Grid.Container>

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
