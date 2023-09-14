import { User } from "../types/user";
import type { FC, ReactNode } from "react";
import { createContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { authApi } from "../api/authApi";

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  platform: "JWT";
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  authRefresh: () => Promise<void>;
  logout: () => Promise<void>;
  register: ({
    username,
    firstName,
    lastName,
    email,
    phone_number,
    password,
  }: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: number;
    password: string;
  }) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

enum ActionType {
  INITIALIZE = "INITIALIZE",
  LOGIN = "LOGIN",
  AUTHREFRESH = "AUTHREFRESH",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    user: User;
  };
};

type AuthRefreshAction = {
  type: ActionType.AUTHREFRESH;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LogoutAction = {
  type: ActionType.LOGOUT;
};

type RegisterAction = {
  type: ActionType.REGISTER;
  payload: {
    isAuthenticated: boolean;
    user: User;
  };
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | AuthRefreshAction;

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: {
    email: "",
    password: "",
  },
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  AUTHREFRESH: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
  }),

  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  authRefresh: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const { success, data } = await authApi.reAuth();

        if (success) {
          const user = {
            ...data,
          };

          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        if (err.code === 30018) {
          await authApi.logout();
          router.push("/").catch(console.error);
        }

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    const { data: user }: any = await authApi.login({
      email,
      password,
    });
    console.log("sssssssss");
    if (user) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          user: user,
          isAuthenticated: true,
        },
      });

      const returnUrl =
        (router.query.returnUrl as string | undefined) || "/employees";
      router.push(returnUrl).catch(console.error);
    }
  };

  const authRefresh = async (): Promise<void> => {
    try {
      const { success, data } = await authApi.reAuth();

      if (success) {
        const user = {
          ...data,
        };
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    dispatch({
      type: ActionType.LOGOUT,
    });

    router.push("/").catch(console.error);
  };

  const register = async ({
    username,
    firstName,
    lastName,
    email,
    phone_number,
    password,
  }: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: number;
    password: string;
  }): Promise<void> => {
    const { data: user }: any = await authApi.register({
      username,
      firstName,
      lastName,
      email,
      phone_number,
      password,
    });

    dispatch({
      type: ActionType.REGISTER,
      payload: {
        user,
        isAuthenticated: true,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        authRefresh,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
