import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import AuthenticatedHeader from "./AuthenticatedHeader";

const HeaderWrapper = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Define public pages that should show the public header
  const publicPages = ["/", "/login", "/register", "/setup"];
  
  // Check if current page is a public page
  const isPublicPage = publicPages.includes(location.pathname);
  
  // Show public header for public pages or when user is not authenticated
  // Show authenticated header for protected pages when user is authenticated
  if (isPublicPage || !currentUser) {
    return <Header />;
  } else {
    return <AuthenticatedHeader />;
  }
};

export default HeaderWrapper;
