/* eslint-disable  no-useless-escape */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/system';
import { Card, Typography, Box } from '@mui/material';

const CheckItem = ({ text, pass }: { text: string; pass: boolean }) => {
  return (
    <Box>
      {pass && <img alt="" src="/static/images/passed-tick"></img>}
      {!pass && <img alt="" src="/static/images/default-tick"></img>}
      <Typography
        sx={{
          fontSize: '14px',
          margin: 0,
          display: 'inline-block',
          color: pass ? '#2fc083' : '#adadad',
          fontWeight: 400,
          letterSpacing: '0.02rem',
          marginLeft: '10px',
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

const specialCharactersArr = [
  '!',
  '#',
  '$',
  '%',
  '&',
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  '[',
  ']',
  '^',
  '_',
  '`',
  '{',
  '|',
  '}',
  '~',
];

interface PasswordValidationFormProps {
  password: string;
  className?: string;
  sx?: SxProps<Theme>;
}

export const PasswordValidationForm: FC<PasswordValidationFormProps> = (
  props
) => {
  const { password, className, sx } = props;

  const [lengthPass, setLengthPass] = useState(false);
  const [upperCasePass, setUpperCasePass] = useState(false);
  const [lowerCasePass, setLowerCasePass] = useState(false);
  const [numSymbolPass, setNumSymbolPass] = useState(false);

  useEffect(() => {
    checkPassword(password);
  }, [password]);

  const checkPassword = (password: string) => {
    const includeSpecialCharacter = (element: string) =>
      specialCharactersArr.includes(element);

    if (password.length >= 8) {
      setLengthPass(true);
    }
    if (password.match(/(?=.*[A-Z])/)) {
      setUpperCasePass(true);
    }
    if (password.match(/(?=.*[a-z])/)) {
      setLowerCasePass(true);
    }
    if (!password.split('').some(includeSpecialCharacter)) {
      setNumSymbolPass(false);
    }
    if (password.length <= 7) {
      setLengthPass(false);
    }
    if (!password.match(/(?=.*[A-Z])/)) {
      setUpperCasePass(false);
    }
    if (!password.match(/(?=.*[a-z])/)) {
      setLowerCasePass(false);
    }
    if (!password.match(/^(?=.*[0-9])/)) {
      setNumSymbolPass(false);
    }
    if (password.split('').some(includeSpecialCharacter)) {
      setNumSymbolPass(true);
    }
  };

  return (
    <Card
      sx={{
        height: 'auto',
        width: '250px',
        position: 'absolute',
        background: '#ffffff',
        zIndex: 2,
        bottom: '-260px',
        padding: '20px 20px 10px 20px',
        '-webkit-box-shadow': '0px 4px 15px -5px rgba(0,0,0,0.3)',
        boxShadow: '0px 10px 15px -5px rgba(0,0,0,0.2)',
        ...sx,
      }}
      className={className}
    >
      <Typography variant="subtitle2">Your password must have:</Typography>
      <Box
        sx={{
          marginTop: '10px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: 'auto',
        }}
      >
        <CheckItem pass={lengthPass} text="At least 8 Characters Long" />
        <CheckItem pass={upperCasePass} text="One Uppercase" />
        <CheckItem pass={lowerCasePass} text="One Lowercase" />
        <CheckItem pass={numSymbolPass} text="One Number and Symbol" />
      </Box>
    </Card>
  );
};
