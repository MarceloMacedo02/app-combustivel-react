import { Button, Container, Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { AxiosRequestConfig } from 'axios';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Edit } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Marcas } from '../../../types/Fipe';
import { Veiculo, veiculoBlank } from '../../../types/Veiculo';
import { VeiculoDTO } from '../../../types/VeiculoDTO';
import { VeiculoFipe } from '../../../types/VeiculoFipe';
import { requestBackend } from '../../../util/requests';
import EditFipe from '../EditFipe';
import RegistroVeiculo from '../RegistroVeiculo';
import ResumoVeiculo from '../ResumoVeículo';
import StatusVeiculo from '../StatusVeiculo';

interface StapVeiculoProps {
  children?: ReactNode;
}
const steps = ['Passo 1', 'Passo 2', 'Passo 3'];
function StapVeiculo({ children }: StapVeiculoProps) {

  const [getRequest, setGetRequest] = useState('');
  const [marcas, setMarcas] = useState<Marcas[]>([]);
  const [veiculoFipe, setveiculoFipe] = useState<VeiculoDTO>({});
  const [veiculo, setveiculo] = useState<Veiculo>(veiculoBlank());
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const getRequestMarcas = 'https://parallelum.com.br/fipe/api/v1/carros/marcas';

  const { register, handleSubmit, formState: { errors, isValid, isDirty }, setValue, getValues, } = useForm();
 
  const params: AxiosRequestConfig = {
    method: 'GET',
    url: getRequest,
  };

  const setveiculoFipeIn = (_veiculoFipe: VeiculoFipe) => {

    setValue('veiculoFipe', _veiculoFipe)
    setveiculo({ ...veiculo, veiculoFipe: _veiculoFipe });

  }
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    /*let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
*/
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //  setSkipped(newSkipped);
  };

  const handleBack = () => {
    if (activeStep === 1) { setveiculo({ ...veiculo, veiculoFipe: null }) };
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {

  };

  var time: any;
  const navigate = useNavigate();
  const onSubmit = (formdata) => {
    setValue('veiculoFipe', veiculo.veiculoFipe)
    console.log(formdata);
    const params: AxiosRequestConfig = {

      method: 'POST',
      url: `/veiculos/insert`,
      data: formdata
    };
    requestBackend(params).then(
      (response) => {

        navigate('/app/veiculos', { replace: true });

      }

    ).catch(
      (error) => {
        console.log(error);

      }
    );

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper>
        <Container>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: ReactNode;
                } = {};

                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Fragment>
                <ResumoVeiculo
                  setveiculo={setveiculo} setValue={setValue}
                  errors={errors} veiculo={veiculo} register={register} getValues={getValues} />

                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, flex: '1 1 auto' }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button type='submit' disabled={!isDirty} >Concuir</Button>
                </Box>
              </Fragment>
            ) : (
              <Fragment>
                {(activeStep == 0) && <EditFipe veiculoFipeuser={veiculo.veiculoFipe ? veiculo.veiculoFipe : null}
             outVeiculoFipe={setveiculoFipeIn} register={register} errors={errors} setValue={setValue} veiculo={veiculo}
              setveiculo={setveiculo} />}
                {(activeStep == 1) && <RegistroVeiculo setveiculo={setveiculo} setValue={setValue} errors={errors} veiculo={veiculo} register={register} />}
                {(activeStep == 2) && <StatusVeiculo setveiculo={setveiculo}
                  setValue={setValue} errors={errors} veiculo={veiculo} register={register} getValues={getValues} />}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {/*isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )*/}
                  <Button onClick={handleNext}>
                    {(activeStep === steps.length - 1) ? 'Finalizar' : (veiculo.veiculoFipe && veiculo.veiculoFipe.codigoFipe.length > 0) && 'Próximo'}
                  </Button>
                </Box>
              </Fragment>
            )}
          </Box>
        </Container>
      </Paper>
    </form>
  );
}

export default StapVeiculo;
