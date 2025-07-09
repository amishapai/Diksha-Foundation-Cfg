import React from "react";
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

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Diksha Foundation</h3>
                <p className="text-emerald-300 text-sm">
                  Nurturing Holistic Growth
                </p>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Creating inclusive, vibrant learning environments that nurture
              complete human development in marginalized communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  Our Programs
                </a>
              </li>
              <li>
                <a
                  href="#impact"
                  className="text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  Impact Stories
                </a>
              </li>
              <li>
                <a
                  href="#volunteer"
                  className="text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  Volunteer
                </a>
              </li>
              <li>
                <a
                  href="#donate"
                  className="text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  Donate
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Focus</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300">Academic Excellence</span>
              </li>
              <li>
                <span className="text-slate-300">Social Development</span>
              </li>
              <li>
                <span className="text-slate-300">Emotional Growth</span>
              </li>
              <li>
                <span className="text-slate-300">Creative Expression</span>
              </li>
              <li>
                <span className="text-slate-300">Civic Participation</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">
                  info@dikshafoundation.org
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
                <span className="text-slate-300">
                  Mumbai, Maharashtra, India
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400">
            © 2025 Diksha Foundation. All rights reserved. | Empowering
            communities through holistic education.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
