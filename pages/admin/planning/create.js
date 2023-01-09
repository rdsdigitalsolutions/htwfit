import Head from 'next/head'
import { useState } from 'react';
import { unstable_getServerSession } from "next-auth/next"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { Text, Spacer, Grid, Input } from '@nextui-org/react';
import { useForm, Controller } from "react-hook-form";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { authOptions } from "./../../api/auth/[...nextauth]"
import { findAll } from '../../../repository/plan'

import Layout from '../../../components/layout'

export default function ComponentHandler({ locale, userPlans }) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [myPlans, setMyPlans] = useState(userPlans);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {}
  });

  const onSubmit = data => {
    setProcessing(true);

    DefaultFetch({
      url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/v1/user`,
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((data) => {
        if (data.error) setError(data.error);
        console.log('Save Profile Response:', data);
      })
      .finally(() => setProcessing(false))
  }

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: t('planning_add_first_title'),
      content: <>
        <Grid.Container gap={4} justify="center">
          <Grid xs={12} >
            <Controller
              name="fullName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Input
                {...field}
                size="md"
                fullWidth={true}
                type="text"
                underlined
                labelPlaceholder={t('global_full_name')}
                disabled={processing}
              />}
            />
          </Grid>
        </Grid.Container>
      </>,
    },
    {
      label: t('planning_add_second_title'),
      content:
        <input type="text" value="test" />,
    },
    {
      label: t('planning_add_third_title'),
      content: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <meta name="description" content={`Another page for ${process.env.NEXT_PUBLIC_APP_NAME}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout locale={locale} restricted={true}>

        <Text h1 css={{ textGradient: "45deg, $yellow600 -20%, $red600 100%", fontSize: '8vw', lineHeight: 'normal' }} weight="bold">
          {t('planning_add_new')}
        </Text>

        <Spacer y={2} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ maxWidth: 400 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last step</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.content}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset
                </Button>
              </Paper>
            )}
          </Box>
        </form>

      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res, locale }) {
  const translations = (await serverSideTranslations(locale, ['common']));
  const session = await unstable_getServerSession(req, res, authOptions)
  const userPlans = await findAll({ userId: session.user.id });
  const currentUserPlan = userPlans.find((plan) => !plan.terminatedAt);

  if(currentUserPlan) {
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
