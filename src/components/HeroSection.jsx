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

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-teal-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4 mr-2" />
                Transforming Lives Through Education
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                Nurturing
                <span className="block text-emerald-600">Holistic Growth</span>
                <span className="block text-slate-700">in Every Child</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                We create vibrant, inclusive learning environments where
                children from marginalized communities flourish academically,
                socially, and emotionally. Our approach goes beyond traditional
                education to nurture complete human development.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="group bg-emerald-600 text-white px-8 py-4 rounded-full hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center font-semibold text-lg no-underline"
              >
                Join Our Mission
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full hover:bg-emerald-50 transition-colors font-semibold text-lg">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-emerald-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">500+</div>
                <div className="text-slate-600 font-medium">
                  Children Impacted
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">12</div>
                <div className="text-slate-600 font-medium">
                  Communities Served
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">95%</div>
                <div className="text-slate-600 font-medium">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Community Learning
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Democratic, inclusive spaces
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Emotional Growth
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Social & emotional development
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Global Values
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Responsibility & reverence for life
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mt-6">
                  <blockquote className="text-slate-700 italic">
                    "Education is not just about literacy—it's about creating
                    compassionate, responsible citizens who can contribute
                    meaningfully to society."
                  </blockquote>
                  <div className="mt-3 text-sm text-emerald-600 font-medium">
                    — Diksha Foundation Team
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-200 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
