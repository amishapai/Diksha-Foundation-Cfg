import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  BookOpen,
  Globe,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">
                Diksha Foundation
              </h1>
              <p className="text-xs text-emerald-600">
                Nurturing Holistic Growth
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="https://dikshafoundation.org/"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#sentiment"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
             Sentiment Analysis
            </a>
            <a
              href="#impact"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Impact
            </a>
            <a
              href="#contact"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Contact
            </a>
            <Link
              to="/chat"
              className="text-slate-700 hover:text-emerald-600 transition-colors font-medium no-underline"
            >
              Access Chatbot
            </Link>
            <Link
              to="/register"
              className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors font-medium no-underline"
            >
              Get Involved
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;
