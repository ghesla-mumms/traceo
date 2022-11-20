import { useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { loadAccount } from "../../auth/state/actions";
import { dispatch } from "../../../store/store";
import { MenuRoute } from "../../../types/navigation";
import { Page } from "../../../core/components/Page";
import Header from "../../../core/components/Layout/Header";
import { useDemo } from "../../../core/hooks/useDemo";

export const DashboardPage = ({ children }) => {
  const { account } = useSelector((state: StoreState) => state.account);
  const { isDemo } = useDemo();

  useEffect(() => {
    dispatch(loadAccount());
  }, []);

  const routes: MenuRoute[] = [
    {
      key: "overview",
      href: "/dashboard/overview",
      label: "Overview",
      adminRoute: false
    },
    {
      key: "management",
      href: "/dashboard/management/accounts",
      label: "Management",
      adminRoute: true,
      private: isDemo
    },
    {
      key: "account",
      href: "/dashboard/account/settings",
      label: "Account",
      adminRoute: false,
      private: isDemo
    }
    // {
    //   key: "updates",
    //   href: "/dashboard/updates",
    //   label: "Updates",
    //   adminRoute: false
    // }
  ];

  const restrictedRoutes = () =>
    !account.isAdmin ? routes.filter((r) => !r.adminRoute) : routes;

  return (
    <>
      <Header routes={restrictedRoutes()} />
      <Page>{children}</Page>
    </>
  );
};
