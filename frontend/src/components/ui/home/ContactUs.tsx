"use client";

import { Button } from "@/components/ui/button";
import ReactLoading from "react-loading";
import { motion, useInView } from "framer-motion";
import {
  AlertCircle,
  CircleX,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import React, { ReactNode, useRef, useState } from "react";
import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";
import axios from "axios";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
};

type responseType = {
  data: Inputs;
  message: string;
  statusCode: number;
  success: boolean;
};

const FakeContactData = [
  {
    address: "+880 1883992408",
    icon: <Phone className="text-green-600" />,
  },
  {
    address: "info@crisop.com",
    icon: <Mail className="text-green-600" />,
  },
  {
    address: "Dhanmondi, Dhaka, Bangladesh",
    icon: <MapPin className="text-green-600" />,
  },
];

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<responseType | null>(null);
  const [responseError, setResponseError] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      setResponse(null);
      setResponseError(false);

      const res = await axios.post(
        "http://localhost:5000/api/v1/contact/email",
        data
      );

      setResponse(res.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setResponseError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-24 bg-gradient-to-b from-white to-green-50" id="contact">
      <div className="mt-10 md:mt-28 max-w-screen-2xl px-5 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT */}
          <motion.div
            ref={ref}
            initial={{ x: -80, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
              Get in touch 👋
            </h1>

            <p className="text-gray-500 mt-5 leading-relaxed max-w-md">
              Have questions about products, delivery, or your orders?  
              Our team is here to help you anytime.
            </p>

            <div className="mt-10 space-y-5">
              {FakeContactData.map((dt) => (
                <div
                  key={dt.address}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="w-11 h-11 flex items-center justify-center bg-green-100 rounded-full">
                    {dt.icon}
                  </div>
                  <span className="text-gray-700">{dt.address}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="md:p-8 rounded-2xl md:bg-white md:shadow-xl md:border md:border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Send Message
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <InputField label="First Name" register={register("firstName")} />
                <InputField label="Last Name" register={register("lastName")} />
                <InputField label="Email" register={register("email")} />
                <InputField label="Phone" register={register("phoneNumber")} />

                <div className="lg:col-span-2">
                  <InputField label="Subject" register={register("subject")} />
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm text-gray-600">Message</label>
                  <textarea
                    {...register("message")}
                    className="mt-1 w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none resize-none"
                  />
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-5 space-y-3">
                {responseError && (
                  <StatusBox
                    color="red"
                    icon={<CircleX />}
                    text="Failed to send message"
                  />
                )}

                {response && (
                  <StatusBox
                    color="green"
                    icon={<MailCheck />}
                    text={response.message}
                  />
                )}

                {loading && (
                  <StatusBox
                    color="gray"
                    icon={<ReactLoading width={20} height={20} type="spin" />}
                    text="Sending..."
                  />
                )}

                {(errors.firstName ||
                  errors.lastName ||
                  errors.email ||
                  errors.phoneNumber ||
                  errors.subject ||
                  errors.message) && (
                  <StatusBox
                    color="yellow"
                    icon={<AlertCircle />}
                    text="All fields are required"
                  />
                )}
              </div>

              <Button
                disabled={loading}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg"
              >
                <Send />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

/* 🔥 Reusable Components */

const InputField = ({ label, register }: {label: string, register: UseFormRegisterReturn}) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...register}
      className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
    />
  </div>
);

type StatusColor = "red" | "green" | "yellow" | "gray";


const StatusBox = ({
  color,
  icon,
  text,
}: {
  color: StatusColor;
  icon: ReactNode;
  text: string;
}) => {
  const colors: Record<StatusColor, string> = {
    red: "text-red-500 border-red-500",
    green: "text-green-500 border-green-500",
    yellow: "text-yellow-500 border-yellow-500",
    gray: "text-gray-500 border-gray-300",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 border rounded-lg ${colors[color]}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};