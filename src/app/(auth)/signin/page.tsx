'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import {
  AuthResponse,
  FormErrorResponse,
  SignInRequestBody,
} from '@/types/auth';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import InputError from '@/components/commons/InputError';

import Wrapper from '@/components/commons/animation';
import { postSignIn } from '@/app/api/auth';

export default function Login() {
  const router = useRouter();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setError,
    watch,
  } = useForm<SignInRequestBody>({
    shouldUseNativeValidation: true,
    mode: 'onBlur',
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const emailValue = watch('email');
  const passwordValue = watch('password');

  useEffect(() => {
    const emailField = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement | null;
    const passwordField = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement | null;

    if (emailField?.value && passwordField?.value) {
      setIsButtonEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (emailValue && passwordValue && isValid) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [emailValue, passwordValue, isValid]);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      router.back();
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }
  }, []);

  const onAuthSucceeded = (response: AuthResponse) => {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    router.back();

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const onAuthFailed = (response: FormErrorResponse) => {
    if (response.details) {
      Object.entries(response.details).forEach(([key, value]) => {
        let fieldName = key.replace(
          'requestBody.',
          ''
        ) as keyof SignInRequestBody;
        let errorMessage = value.message;
        setError(fieldName, { type: 'custom', message: errorMessage });
      });
    } else {
      console.error('Error details are missing or undefined', response);
    }
  };
  const onSubmit: SubmitHandler<SignInRequestBody> = data => {
    postSignIn(data).then(onAuthSucceeded, onAuthFailed);
  };

  return (
    <Wrapper>
      <div className="block">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="last-child:mb-[24px]"
        >
          <label className="block">
            <Input
              type="email"
              placeholder="이메일"
              autoComplete="username"
              {...register('email', {
                required: '이메일 주소를 입력해주세요',
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: '잘못된 이메일 주소입니다.',
                },
              })}
              hasError={!!errors.email}
            />
            <InputError isVisible={!!errors.email}>
              {errors.email?.message || ' '}
            </InputError>
          </label>
          <label className="block">
            <Input
              type="password"
              placeholder="비밀번호"
              autoComplete="current-password"
              {...register('password', { required: '비밀번호를 입력해주세요' })}
              hasError={!!errors.password}
            />
            <InputError isVisible={!!errors.password}>
              {errors.password?.message || ' '}
            </InputError>
          </label>
          <Button
            variant="wide"
            type="submit"
            disabled={!isButtonEnabled}
            size={{ default: 'xl', md: '2xl', xl: '3xl' }}
          >
            로그인
          </Button>
        </form>
        <div className="mb-[40px] mt-2 text-center text-blue-400 sm:typo-md-medium md:typo-lg-medium lg:typo-xl-medium lg:mt-4">
          회원이 아니신가요?&nbsp;
          <Link
            href="/signup"
            className="font-medium text-black-500 underline sm:text-[14px]/[26px] md:text-[16px]/[26px] lg:text-[20px]/[26px]"
          >
            가입하기
          </Link>
        </div>
        <p className="mb-[26px] flex flex-row text-blue-400 before:m-auto before:mr-2.5 before:flex-1 before:border-b before:border-solid before:border-blue-400 before:content-[''] after:m-auto after:ml-2.5 after:flex-1 after:border-b after:border-solid after:border-blue-400 after:content-[''] lg:mb-[40px]">
          SNS 계정으로 로그인하기
        </p>
        <div className="flex flex-row justify-center gap-x-[16px] *:h-[40px] *:w-[40px] lg:*:h-[60px] lg:*:w-[60px]"></div>
      </div>
    </Wrapper>
  );
}
