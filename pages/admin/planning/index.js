import Head from 'next/head'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from "next-auth/next"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useForm, Controller } from "react-hook-form";
import { Text, Button, Spacer, Grid, Switch, Card, Avatar, Badge, Input, Progress } from '@nextui-org/react';
import { FaCircle, FaExclamationTriangle, FaArrowRight, FaGlobe } from "react-icons/fa";
import { useTheme } from '@nextui-org/react';

import { authOptions } from "./../../api/auth/[...nextauth]"
import { findAll } from '../../../repository/plan'
import DefaultModal from '../../../components/default-modal'
import DefaultFetch from '../../../lib/default-fetch'

import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from '../../../components/layout'
import Link from 'next/link';

export default function ComponentHandler({ locale, currentUserPlan, session }) {
  const { t } = useTranslation('common');
  const { isDark } = useTheme();
  const router = useRouter();

  const [statusMessage, setStatusMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(currentUserPlan);

  const [visibleFinishModal, setVisibleFinishModal] = useState(false);
  const handlerFinishModal = () => setVisibleFinishModal(true);

  const [visibleSizesModal, setVisibleSizesModal] = useState(false);
  const handlerSizeModal = () => setVisibleSizesModal(true);

  const { handleSubmit: handleNewMensurements, control, reset: resetNewMeansurements } = useForm({ defaultValues: currentPlan.mensurements.length ? currentPlan.mensurements[currentPlan.mensurements.length - 1] : {} });

  const onSubmitNewMensurements = formData => {
    setVisibleSizesModal(false);

    if (!formData.weight) {
      setStatusMessage('Weight information is required!');
      return;
    }

    setProcessing(true);

    const newPlan = {
      ...currentPlan,
      updatedAt: moment().format(),
      mensurements: [
        ...currentPlan.mensurements,
        {
          date: moment().format(),
          ...formData
        }
      ]
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

  const handleMakePublic = () => {
    const newPlan = {
      ...currentPlan,
      updatedAt: moment().format(),
      publicUID: currentPlan.publicUID ? null : uuidv4()
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

  const onSubmitFinishPlan = event => {
    event.preventDefault();
    setVisibleFinishModal(false);
    setProcessing(true);

    const newPlan = { ...currentPlan, terminatedAt: moment().format() };

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

        router.push('/admin/planning/dashboard');
      })
      .finally(() => setProcessing(false))
  }

  const processMeansurementName = (string) => {
    const fullString = string.split(/(?=[A-Z])/).join(' ');
    return fullString.charAt(0).toUpperCase() + fullString.slice(1);
  }

  const CircleElement = ({ children, width, color, total }) => <div style={{ width: width }}>
    <CircularProgressbarWithChildren
      value={total}
      strokeWidth={10}
      styles={buildStyles({
        pathColor: color,
        trailColor: isDark ? '#181818' : '#ededed',
      })}
    >
      {children}
    </CircularProgressbarWithChildren>
  </div>

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultModal locale={locale} title={'Finish Current Plan'} visible={visibleFinishModal} setVisible={setVisibleFinishModal} onSubmitHandler={onSubmitFinishPlan}>
        <Grid.Container gap={0.5} justify="center">
          <Grid xs={12} justify="center">
            <FaExclamationTriangle size='60' />
          </Grid>
          <Grid xs={12} justify="center">
            <Text h5 css={{ textAlign: 'center' }}>
              Once a plan is finished, you will not be able to restart it.
            </Text>
          </Grid>
          <Grid xs={12} justify="center">
            <Text h6 css={{ textAlign: 'center' }} color='gray'>
              Make sure you are ready to finish it and then confirm. Once it is done you will be able to start a new plan or clone this one.
            </Text>
          </Grid>
        </Grid.Container>
      </DefaultModal>

      <DefaultModal locale={locale} title={'Add New Sizes'} visible={visibleSizesModal} setVisible={setVisibleSizesModal} onSubmitHandler={handleNewMensurements(onSubmitNewMensurements)}>
        <Grid.Container gap={0.5} justify="center">
          <Grid xs={6} justify="center">
            <Controller
              name="weight"
              control={control}
              rules={{ required: true, min: 0, max: 200 }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Weight"
                type='number'
              />}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <Controller
              name="chest"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Chest"
                type='number'
              />}
            />
          </Grid>
        </Grid.Container>

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={6} justify="center">
            <Controller
              name="leftArm"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Left Arm"
                type='number'
              />}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <Controller
              name="rightArm"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Right Arm"
                type='number'
              />}
            />
          </Grid>
        </Grid.Container>

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={6} justify="center">
            <Controller
              name="waist"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Waist"
                type='number'
              />}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <Controller
              name="hips"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Hips"
                type='number'
              />}
            />
          </Grid>
        </Grid.Container>

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={6} justify="center">
            <Controller
              name="leftThigh"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Left Thigh"
                type='number'
              />}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <Controller
              name="rightThigh"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Right Thigh"
                type='number'
              />}
            />
          </Grid>
        </Grid.Container>

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={6} justify="center">
            <Controller
              name="leftCalf"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Left Calf"
                type='number'
              />}
            />
          </Grid>
          <Grid xs={6} justify="center">
            <Controller
              name="rightCalf"
              control={control}
              rules={{ required: false }}
              render={({ field }) => <Input
                {...field}
                clearable
                underlined
                fullWidth
                color="primary"
                size="sm"
                label="Right Calf"
                type='number'
              />}
            />
          </Grid>
        </Grid.Container>

        <Spacer y={0.5} />

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={12} justify="center">
            <Text h6 color='gray'>
              Always use the same scale to mensure your weight, this way you will keep the values accurate.
            </Text>
          </Grid>
        </Grid.Container>
      </DefaultModal>

      <Layout locale={locale} restricted={true}>

        <Spacer y={0.5} />

        <Grid.Container gap={0.5} justify="center">
          <Grid xs={4} justify="left">
            <Text h6 color='gray'>Public</Text>
            <Spacer x={0.2} />
            <Switch size="xs" checked={!!currentPlan.publicUID} onClick={() => handleMakePublic()} />
            {currentPlan.publicUID && <>
              <Spacer x={0.2} />
              <Link href={``} target='_blank'>
                <Button auto shadow flat size="xs" color='primary'><FaGlobe /></Button>
              </Link>
            </>}
          </Grid>
          <Grid xs={5} justify="right">
            <Button size="xs" shadow onClick={handlerSizeModal} color='primary'> Mensurements</Button>
          </Grid>
          <Grid xs={3} justify="right">
            <Button shadow size="xs" color='warning' onClick={handlerFinishModal}>Finish Plan</Button>
          </Grid>
        </Grid.Container>

        <Spacer y={0.8} />

        {statusMessage && <Grid.Container gap={0} justify="center">
          <Grid xs={12} justify="center">
            <Text h4 color='warning' css={{ textAlign: 'center' }} >{statusMessage}</Text>
          </Grid>
        </Grid.Container>
        }

        <Badge disableOutline isSquared content={`${currentPlan.lengthInWeeks} ${t('global_weeks')}`} size="sm" placement="top-right" variant="bordered" horizontalOffset="5%" verticalOffset="-5%" color='primary'>
          <Card>
            <Card.Body>
              <Grid.Container gap={0} justify="center">
                <Grid xs={12} justify="center">
                  <Text h1 css={{ textAlign: 'center', textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '8vw', lineHeight: 'normal' }} weight="bold">
                    {currentPlan.goal}
                  </Text>
                </Grid>
                <Grid xs={12} justify="center">
                  <Text h6 css={{ textAlign: 'center' }}>
                    {currentPlan.observations}
                  </Text>
                </Grid>
                {/* <Grid xs={12} justify="center">
                  <Text h6 weight="bold" color='gray'>
                    {t(moment(currentPlan.createdAt).format('MMMM'))} {moment(currentPlan.createdAt).format('YYYY')} - {t(moment(currentPlan.createdAt).add(currentPlan.lengthInWeeks, 'w').format('MMMM'))} {moment(currentPlan.createdAt).add(currentPlan.lengthInWeeks, 'w').format('YYYY')}
                  </Text>
                </Grid> */}
                <Grid xs={12} justify="center">
                  <Progress color="primary" size="xs" value={((Number((currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)) + currentPlan.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (currentPlan.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (currentPlan.exercises.length + 1)).toFixed(0)} />
                </Grid>
                <Spacer y={0.5} />
                <Grid xs={12} justify="center">
                  <Text small color='gray'>
                    {((Number((currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)) + currentPlan.exercises.reduce((acc, curr) => acc + Number(((curr.done.length / (currentPlan.lengthInWeeks * curr.days.length)) * 100).toFixed(0)), 0)) / (currentPlan.exercises.length + 1)).toFixed(0)}% Total Plan Complete
                  </Text>
                </Grid>

              </Grid.Container>
            </Card.Body>
          </Card>
        </Badge>

        <Spacer y={1} />

        <Grid.Container gap={0} justify="center">
          <Grid xs={12} justify="center">

            <div style={{ width: "75%" }}>
              <CircularProgressbarWithChildren
                value={(currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: "#156dc5",
                  trailColor: isDark ? '#181818' : '#ededed',
                })}
              >

                {currentPlan.exercises.reduce((acc, curr) => <CircleElement width='76%' color={curr.color} total={((curr.done.length / (currentPlan.lengthInWeeks * curr.days.length)) * 100).toFixed(0)}>{acc}</CircleElement>, <Avatar
                  color="primary"
                  size="xl"
                  src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${session.user.image}`}
                />)}

              </CircularProgressbarWithChildren>
            </div>

          </Grid>
        </Grid.Container>

        <Spacer y={0.5} />

        <Grid.Container gap={0} justify="center">
          <Grid xs={12} justify="center">
            <Text h6 weight="bold">
              Average session duration:
            </Text>
            <Spacer x={0.5} />
            <Text h6 weight="bold" color='secondary'>
              {(currentPlan.exercises.reduce((acc, curr) => acc + (curr.done.reduce((subAcc, subCurr) => subAcc + (subCurr.duration||0), 0) / (curr.done.length||1)), 0) / (currentPlan.exercises.length||1)).toFixed(0)} min.
            </Text>
          </Grid>
        </Grid.Container>

        <Spacer y={0.5} />

        <Card>
          <Card.Body>
            <Grid.Container gap={0} justify="center">
              <Grid xs={3} justify="left">
                <FaCircle color='#156dc5' /> <Spacer x={0.5} /> <Text h6 weight="bold">{(currentPlan.foodPlan.meals.reduce((acc, curr) => acc + curr.done.length, 0) / ((currentPlan.lengthInWeeks * 7) * currentPlan.foodPlan.meals.length) * 100).toFixed(0)}%</Text>
              </Grid>
              <Grid xs={9} justify="left">
                <Text h5 weight="bold">
                  Overall Food Plan
                </Text>
              </Grid>
            </Grid.Container>

            {currentPlan.exercises.map((exercise, index) => (<Grid.Container key={index} gap={0} justify="center">
              <Grid xs={3} justify="left">
                <FaCircle color={exercise.color} /> <Spacer x={0.5} /> <Text h6 weight="bold">{((exercise.done.length / (currentPlan.lengthInWeeks * exercise.days.length)) * 100).toFixed(0)}%</Text>
              </Grid>
              <Grid xs={9} justify="left">
                <Text h5 weight="bold">
                  {exercise.title}
                </Text>
              </Grid>
            </Grid.Container>))}

          </Card.Body>
        </Card>

        <Spacer y={1} />

        <Grid.Container gap={0} justify="center">

          {['weight', 'chest', 'leftArm', 'rightArm', 'waist', 'hips', 'leftThigh', 'rightThigh', 'leftCalf', 'rightCalf'].map((indicator, index) => (currentPlan.mensurements[index] && <>
          
          <Grid key={index} xs={12} justify="center">
            <Grid.Container gap={0} justify="center">
              <Grid xs={5} justify="left">
                <Text h6 weight="bold" color='secondary'>{processMeansurementName(indicator)}:</Text>
              </Grid>
              {currentPlan.mensurements[0][indicator] === currentPlan.mensurements[currentPlan.mensurements.length - 1][indicator] && <Grid xs={7} justify="right">
                <Text h6 >{currentPlan.mensurements[index][indicator]}{indicator === 'weight' ? 'kg' : 'cm'}</Text>
              </Grid>}

              {currentPlan.mensurements[0][indicator] !== currentPlan.mensurements[currentPlan.mensurements.length - 1][indicator] && <>
                <Grid xs={2} justify="left">
                  <Text h6 >{currentPlan.mensurements[0][indicator]}{indicator === 'weight' ? 'kg' : 'cm'}</Text>
                </Grid>
                <Grid xs={1} justify="left">
                  <Text h6 ><FaArrowRight /></Text>
                </Grid>
                <Grid xs={2} justify="left">
                  <Text h6 >{currentPlan.mensurements[currentPlan.mensurements.length - 1][indicator]}{indicator === 'weight' ? 'kg' : 'cm'}</Text>
                </Grid>
                <Grid xs={2} justify="left">
                  <Text h6 color='secondary'>({(currentPlan.mensurements[currentPlan.mensurements.length - 1][indicator] - currentPlan.mensurements[0][indicator]).toFixed(1)}{indicator === 'weight' ? 'kg' : 'cm'})</Text>
                </Grid>
              </>}

            </Grid.Container>
          </Grid>
          
          </>))}

        </Grid.Container>

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)
  const userPlans = (await findAll({ userId: session.user.id }) || []);
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
