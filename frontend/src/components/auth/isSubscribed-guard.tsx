/* eslint-disable react-hooks/rules-of-hooks */
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/use-auth';

interface IsSubscribedProps {
  children: ReactNode;
}

export const IsSubscribed: FC<IsSubscribedProps> = (props) => {
  const { children } = props;
  const { user } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (!user?.store || !user?.store?.is_subscribed) {
        router
          .push({
            pathname: '/',
            query: { returnUrl: router.asPath },
          })
          .catch(console.error);
      } else {
        setChecked(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

IsSubscribed.propTypes = {
  children: PropTypes.node,
};