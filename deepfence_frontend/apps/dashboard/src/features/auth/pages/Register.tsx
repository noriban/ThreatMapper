import cx from 'classnames';
import { Link, redirect, useFetcher } from 'react-router-dom';
import { Button, Card, TextInput, Typography } from 'ui-components';
import { z, ZodError } from 'zod';

import LogoDarkBlue from '../../../assets/logo-deepfence-dark-blue.svg';
import storage from '../../../utils/storage';

const passwordSchema = z
  .string()
  .regex(new RegExp('.*[A-Z].*'), 'Must include one uppercase character')
  .regex(new RegExp('.*[a-z].*'), 'Must inlucde one lowercase character')
  .regex(new RegExp('.*\\d.*'), 'One number')
  .regex(
    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
    'Must include one special character',
  )
  .min(8, 'Must be at least 8 characters in length')
  .max(32, 'Must be at most 32 characters in length');

const SchemaValidation = z.object({
  password: passwordSchema,
});

export const registerAction = async ({
  request,
}: {
  request: Request;
  params: Record<string, unknown>;
}) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    SchemaValidation.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const { fieldErrors: errors } = error.flatten();
      console.log(errors);
      return {
        error: {
          message: 'Please enter correct credentials',
        },
      };
    }
  }

  storage.setAuth({ isLogin: true });
  return redirect('/home', {});
};

export const Register = () => {
  const fetcher = useFetcher();

  const { data, state } = fetcher;

  return (
    <div className="h-full flex items-center justify-center">
      <fetcher.Form method="post">
        <Card className="w-[384px] p-8">
          <div className="text-center">
            <img
              src={LogoDarkBlue}
              alt="Deefence Logo"
              width={'55.46'}
              height={'34.74'}
              className="m-auto"
            />
          </div>
          <h1
            className={cx(
              `${Typography.size['2xl']} ${Typography.weight.medium}`,
              'dark:text-white text-center leading-6 mb-6 mt-2',
            )}
          >
            Register for Deepfence
          </h1>
          <TextInput
            label="First Name"
            type={'text'}
            placeholder="First Name"
            sizing="sm"
            name="firstName"
            className="mb-2.5"
          />
          <TextInput
            label="Last Name"
            type={'text'}
            placeholder="Last Name"
            sizing="sm"
            name="lastName"
            className="mb-2.5"
          />
          <TextInput
            label="Password"
            type={'password'}
            placeholder="Password"
            sizing="sm"
            name="password"
            className="mb-2.5"
          />
          <TextInput
            label="Confirm Password"
            type={'password'}
            placeholder="ConfirmPassword"
            sizing="sm"
            name="confirmPassword"
            className="mb-2.5"
          />
          <TextInput
            label="Company"
            type={'text'}
            placeholder="Company"
            sizing="sm"
            name="company"
            className="mb-2.5"
          />
          <div className="flex flex-col w-full mt-6">
            <Button size="md" color="primary" className="w-full">
              Register
            </Button>
          </div>
          <div
            className={`py-4 flex flex-col text-center ${Typography.size.xs} dark:text-white leading-6`}
          >
            By Signing up you agree to our
            <Link to="/" className="text-blue-600">
              License Agreement
            </Link>
          </div>
          <div
            className={`flex flex-row justify-center dark:text-white ${Typography.size.xs} leading-6`}
          >
            Already have an account?
            <Link to="/auth/login" className="text-blue-600">
              &nbsp;Login
            </Link>
          </div>
          <div>
            {data?.error
              ? data.error.message
              : state === 'submitting'
              ? 'Loading...'
              : null}
          </div>
        </Card>
      </fetcher.Form>
    </div>
  );
};
