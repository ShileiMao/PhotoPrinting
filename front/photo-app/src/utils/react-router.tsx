import React, { useEffect } from "react";
import { ComponentType } from 'react';
import { NavigateFunction, useLocation, useNavigate, useParams } from "react-router";
import AdminOrderDetails from "../routes/admin/AdminOrderDetails";


export interface WithRouterProps<T = ReturnType<typeof useParams>> {
  history: {
    back: () => void;
    goBack: () => void;
    location: ReturnType<typeof useLocation>;
    push: (url: string, state?: any) => void;
  }
  location: ReturnType<typeof useLocation>;
  match: {
    params: T;
  };
  navigate: ReturnType<typeof useNavigate>;
}

export const withRouter = <P extends object>(Component: ComponentType<P>) => {
  return (props: Omit<P, keyof WithRouterProps>) => {
    const location = useLocation();
    const match = { params: useParams() };
    const navigate = useNavigate();


    const history = {
      back: () => navigate(-1),
      goBack: () => navigate(-1),
      location,
      push: (url: string, state?: any) => navigate(url, { state }),
      replace: (url: string, state?: any) => navigate(url, {
        replace: true,
        state
      })
    };

    return (
      <Component
        history={history}
        location={location}
        match={match}
        navigate={navigate}
        {...props as P}
      />
    );
  };
};

