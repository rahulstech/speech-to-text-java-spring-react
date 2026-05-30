import React, { useState, useEffect } from "react";
import Icon from "../components/Icon";
import TextInputField from "../components/TextInputField";
import PasswordInputField from "../components/PasswordInputField";
import { useUserRegistraiton } from "../hooks/AuthHooks";
import ErrorBanner from "../components/ErrorBanner";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface RegistrationFieldError {
  name?: string,
  email?: string,
  password?: string
}

export default function Registration() {
  const { setPageTitle } = useAppContext()
  
    useEffect(()=> {
      setPageTitle("Register - Speech to Text")
    }, [])

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldError>({});
  const { isPending, error, mutate } = useUserRegistraiton()

  const validate = () => {
    const errors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (password.length > 16) {
      errors.password = "Password must not exceed 16 characters";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!validate()) return;

    mutate({ email, password, name }, {
      onSuccess() {
        // TODO: set Is Loggedin = true
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#F5C12E] flex items-center justify-center p-4 font-sans relative overflow-hidden select-none">
      <div className="bg-white w-full max-w-[400px] min-w-[400px] rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 transition-all duration-300 transform scale-100 hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
        {/* Waveform Logo */}
        <div className="w-16 h-16 bg-[#F5C12E] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm transform hover:scale-105 transition-transform duration-200">
          <Icon src="/icons/logo_waveform.svg" className="w-8 h-8" colorClass="bg-slate-900" />
        </div>

        {/* Header Text */}
        <div className="text-center mb-7">
          <h2 className="text-[26px] font-extrabold text-slate-800 tracking-tight leading-none mb-2">
            Create Account
          </h2>
          <p className="text-[13px] font-medium text-slate-400">
            Join the Magenta Sonic voice network
          </p>
        </div>

        {/* Global Error Banner */}
        <ErrorBanner error={error} defaultMessage="unknown registration error" />

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <TextInputField
            label="Name"
            placeholder="John Doe"
            value={name}
            onChange={(val) => {
              setName(val);
              if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: "" }));
            }}
            iconSrc="/icons/person.svg"
            error={fieldErrors.name}
            disabled={isPending}
          />

          {/* Email Field */}
          <TextInputField
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: "" }));
            }}
            type="email"
            iconSrc="/icons/email.svg"
            error={fieldErrors.email}
            disabled={isPending}
          />

          {/* Password Field */}
          <PasswordInputField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: "" }));
            }}
            iconSrc="/icons/key_vertical.svg"
            error={fieldErrors.password}
            disabled={isPending}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[52px] bg-[#F5C12E] hover:bg-[#E2AF24] disabled:bg-[#F5C12E]/70 disabled:cursor-not-allowed text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,193,46,0.2)] hover:shadow-[0_6px_16px_rgba(245,193,46,0.35)] transition-all duration-150 active:scale-[0.98] select-none text-[15px]"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Register</span>
                <Icon src="/icons/arrow_right.svg" className="w-4 h-4 translate-y-px" colorClass="bg-slate-900" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Screen Mode Link */}
        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-[13px] font-bold text-[#F5C12E] hover:text-[#E2AF24] transition-colors focus:outline-none"
          >
            <span className="text-slate-400 font-semibold">Already have an account? </span>
            <span>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
