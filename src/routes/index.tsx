import React, { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Root from "./RootRoute";
import Navbar from "../components/navbar/Navbar";
import Dashboard from "../pages/Dashboard";
import ReviewsDirectory from "../pages/Reviews/ReviewsDirectory";
import AppsDirectory from "../pages/Apps/AppsDirectory";
import UploadApps from "../pages/Apps/UploadApps";
import Footer from "../components/footer/Footer";
import SignUpForm from "../pages/Auth/SignUp/SignUpForm";
import LoginForm from "../pages/Auth/Login/LoginForm";
import { Container } from "react-bootstrap";
import ReviewAnalyzer from "../pages/Reviews/ReviewAnalyzer";
import PrivateRoutes from './PrivateRoutes';
import KGDirectory from '../pages/Apps/KGDirectory';
import TreeAnalyzer from "../pages/Reviews/TreeAnalyzer";
import MetaAppCollector from "../metaappcollector/pages/MetaAppCollector";
import NewAppForm from "../metaappcollector/pages/NewAppForm";
import AppDetail from "../metaappcollector/pages/AppDetail";
import EditAppForm from "../metaappcollector/pages/EditAppForm";
interface LayoutProps {
    children: ReactNode;
}

import { useLocation } from 'react-router-dom';

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMetaAppCollector = location.pathname.startsWith('/meta-app-collector');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      {isMetaAppCollector ? (
        <div className="">{children}</div>
      ) : (
        <Container className="py-4 flex-fill">{children}</Container>
      )}
      <Footer />
    </div>
  );
};


const AuthenticatedRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<PrivateRoutes />}>
                <Route path="/" element={<DefaultLayout><Root /></DefaultLayout>} />
                <Route path="/dashboard" element={<DefaultLayout><Dashboard /></DefaultLayout>} />
                <Route path="/applications/directory" element={<DefaultLayout><KGDirectory /></DefaultLayout>} />
                <Route path="/applications" element={<DefaultLayout><AppsDirectory /></DefaultLayout>} />
                <Route path="/applications/upload" element={<DefaultLayout><UploadApps /></DefaultLayout>} />
                <Route path="/reviews" element={<DefaultLayout><ReviewsDirectory /></DefaultLayout>} />
                <Route path="applications/:appId/reviews/:reviewId/analyze" element={<DefaultLayout><ReviewAnalyzer /></DefaultLayout>} />
                <Route path="/tree-analyzer" element={<DefaultLayout><TreeAnalyzer /></DefaultLayout>} />
                <Route path="/meta-app-collector" element={<DefaultLayout><MetaAppCollector /></DefaultLayout>}>
                    <Route path="apps/:id" element={<AppDetail />} />
                    <Route path="apps/new" element={<NewAppForm />} />
                    <Route path="apps/:id/edit" element={<EditAppForm />} />
                </Route>
            </Route>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />

        </Routes>
    );
};


const ApplicationRoutes: React.FC = () => {
    return (
        <AuthenticatedRoutes />
    );
};

export default ApplicationRoutes;
