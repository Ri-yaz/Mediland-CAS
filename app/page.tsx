import { Button } from "@/components/ui/button";
import { getRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  const role = await getRole();

  if (userId && role) {
    redirect(`/${role}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/mediland.jpg"
              alt="Mediland Logo"
              width={100}
              height={100}


              className="rounded-md object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              <Link
                href="#Mediland-CAS"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
              >Mediland-CAS</Link>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#about"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium text-gray-600">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105">
                New Patient
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now accepting new patients
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Your Health, <br />
              <span className="text-blue-600">Our Priority</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto md:mx-0 leading-relaxed">
              Experience modern healthcare with Mediland. streamlined appointments,
              digital records, and compassionate care all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                  Book Appointment
                </Button>
              </Link>
              <Link href="#about">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center md:justify-start gap-8 border-t border-gray-100">

            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100/50">
              <Image
                src="/landingpage.jpg"
                alt="Doctor with patient"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Mediland?</h2>
            <p className="text-gray-500 text-lg">
              We combine advanced technology with dedicated care to ensure you receive the best medical attention possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: "Expert Doctors",
                desc: "Our team consists of highly qualified professionals across various specialties.",
              },
              {
                icon: CalendarCheck,
                title: "Easy Scheduling",
                desc: "Book appointments online instantly without the hassle of waiting calls.",
              },
              {
                icon: ShieldCheck,
                title: "Secure Records",
                desc: "Your medical history is safe, private, and easily accessible to you.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="grid md:grid-cols-2 gap-12 relative z-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Contact Us
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Need assistance or have questions? Our support team is here to help you 24/7.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Phone</p>
                      <p className="font-medium">+977 9818932000</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Location</p>
                      <p className="font-medium">Kamalbinayak, Bhaktapur</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Working Hours</p>
                      <p className="font-medium">Mon - Sat: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input type="text" className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input type="text" className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea rows={4} className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 text-sm">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Mediland-CAS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
