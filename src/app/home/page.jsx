"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Bell, ChevronRightIcon, Edit2Icon, Settings, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getClientErrorMessage, isUnauthorizedError } from "@/lib/api/error";
import {
  useCreateChatMutation,
  useGetProfileQuery,
  useLogoutMutation,
} from "@/lib/store";
import { useTheme } from "@/components/providers/ThemeProvider";

const CollapseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="16"
    viewBox="0 0 24 16"
    fill="none"
  >
    <path
      d="M22 8L12 13L2 8"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L12 7L2 2"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Settings menu items data ─────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    label: "New Chat",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 17V31"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 24H31"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "History",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 20V24L26 26"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.05 23C15.274 20.8 16.3 18.76 17.932 17.268C19.565 15.776 21.69 14.938 23.9 14.913C26.112 14.887 28.255 15.677 29.921 17.131C31.587 18.585 32.66 20.602 32.934 22.796C33.208 24.99 32.665 27.209 31.408 29.028C30.151 30.847 28.268 32.14 26.119 32.66C23.97 33.18 21.704 32.89 19.755 31.846C17.805 30.802 16.308 29.077 15.55 27M15.05 32V27H20.05"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Banks & Cards",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M15 33H33"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 22H33"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 18L24 15L31 18"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 22V33"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 22V33"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 26V29M24 26V29M28 26V29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Payment Methods",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M29 20V17C29 16.735 28.895 16.48 28.707 16.293C28.52 16.105 28.265 16 28 16H18C17.47 16 16.961 16.211 16.586 16.586C16.211 16.961 16 17.47 16 18M16 18C16 18.53 16.211 19.039 16.586 19.414C16.961 19.789 17.47 20 18 20H30C30.265 20 30.52 20.105 30.707 20.293C30.895 20.48 31 20.735 31 21V24M16 18V30C16 30.53 16.211 31.039 16.586 31.414C16.961 31.789 17.47 32 18 32H30C30.265 32 30.52 31.895 30.707 31.707C30.895 31.52 31 31.265 31 31V28"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 24V28H28C27.47 28 26.961 27.789 26.586 27.414C26.211 27.039 26 26.53 26 26C26 25.47 26.211 24.961 26.586 24.586C26.961 24.211 27.47 24 28 24H32Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Credits",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M16 19C16 17.939 16.421 16.922 17.172 16.172C17.922 15.421 18.939 15 20 15H28C29.061 15 30.078 15.421 30.828 16.172C31.579 16.922 32 17.939 32 19C32 20.061 31.579 21.078 30.828 21.828C30.078 22.579 29.061 23 28 23H20C18.939 23 17.922 22.579 17.172 21.828C16.421 21.078 16 20.061 16 19Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 29C19 27.939 19.421 26.922 20.172 26.172C20.922 25.421 21.939 25 23 25H31C32.061 25 33.078 25.421 33.828 26.172C34.579 26.922 35 27.939 35 29C35 30.061 34.579 31.078 33.828 31.828C33.078 32.579 32.061 33 31 33H23C21.939 33 20.922 32.579 20.172 31.828C19.421 31.078 19 30.061 19 29Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 19H26M25 29H29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Subscriptions",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M23 18C23 18.796 23.527 19.559 24.464 20.121C25.402 20.684 26.674 21 28 21C29.326 21 30.598 20.684 31.536 20.121C32.473 19.559 33 18.796 33 18C33 17.204 32.473 16.441 31.536 15.879C30.598 15.316 29.326 15 28 15C26.674 15 25.402 15.316 24.464 15.879C23.527 16.441 23 17.204 23 18Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 18V22C23 23.657 25.239 25 28 25C30.761 25 33 23.657 33 22V18M23 22V26C23 27.657 25.239 29 28 29C30.761 29 33 27.657 33 26V22M23 26V30C23 31.657 25.239 33 28 33C30.761 33 33 31.657 33 30V26"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 21H16.5C16.102 21 15.721 21.158 15.439 21.439C15.158 21.721 15 22.102 15 22.5C15 22.898 15.158 23.279 15.439 23.561C15.721 23.842 16.102 24 16.5 24H17.5C17.898 24 18.279 24.158 18.561 24.439C18.842 24.721 19 25.102 19 25.5C19 25.898 18.842 26.279 18.561 26.561C18.279 26.842 17.898 27 17.5 27H15M17 27V28M17 20V21"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Personal Info",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M15 19C15 18.204 15.316 17.441 15.879 16.879C16.441 16.316 17.204 16 18 16H30C30.796 16 31.559 16.316 32.121 16.879C32.684 17.441 33 18.204 33 19V29C33 29.796 32.684 30.559 32.121 31.121C31.559 31.684 30.796 32 30 32H18C17.204 32 16.441 31.684 15.879 31.121C15.316 30.559 15 29.796 15 29V19Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 22C19 22.53 19.211 23.039 19.586 23.414C19.961 23.789 20.47 24 21 24C21.53 24 22.039 23.789 22.414 23.414C22.789 23.039 23 22.53 23 22C23 21.47 22.789 20.961 22.414 20.586C22.039 20.211 21.53 20 21 20C20.47 20 19.961 20.211 19.586 20.586C19.211 20.961 19 21.47 19 22ZM27 20H29M27 24H29M19 28H29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Security",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 15C26.335 17.067 29.383 18.143 32.499 18C32.952 19.543 33.091 21.162 32.907 22.759C32.723 24.357 32.219 25.901 31.426 27.3C30.633 28.7 29.567 29.925 28.291 30.905C27.015 31.884 25.556 32.596 24 33C22.442 32.596 20.982 31.884 19.706 30.905C18.43 29.925 17.364 28.7 16.571 27.3C15.779 25.901 15.275 24.357 15.091 22.759C14.906 21.162 15.045 19.543 15.499 18C18.614 18.143 21.663 17.067 24 15Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 23C23 23.265 23.105 23.52 23.293 23.707C23.48 23.895 23.735 24 24 24C24.265 24 24.52 23.895 24.707 23.707C24.895 23.52 25 23.265 25 23C25 22.735 24.895 22.48 24.707 22.293C24.52 22.105 24.265 22 24 22C23.735 22 23.48 22.105 23.293 22.293C23.105 22.48 23 22.735 23 23ZM24 24V26.5"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Marketing Preferences",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M30 20C30.796 20 31.559 20.316 32.121 20.879C32.684 21.441 33 22.204 33 23C33 23.796 32.684 24.559 32.121 25.121C31.559 25.684 30.796 26 30 26M22 20V31C22 31.265 21.895 31.52 21.707 31.707C21.52 31.895 21.265 32 21 32H20C19.735 32 19.48 31.895 19.293 31.707C19.105 31.52 19 31.265 19 31V26M24 20L28.524 16.23C28.655 16.12 28.815 16.051 28.985 16.029C29.155 16.007 29.327 16.034 29.482 16.107C29.637 16.179 29.768 16.294 29.86 16.439C29.951 16.583 30 16.751 30 16.922V29.078C30 29.249 29.951 29.417 29.86 29.561C29.768 29.706 29.637 29.821 29.482 29.893C29.327 29.966 29.155 29.993 28.985 29.971C28.815 29.949 28.655 29.879 28.524 29.77L24 26H16C15.735 26 15.48 25.895 15.293 25.707C15.105 25.52 15 25.265 15 25V21C15 20.735 15.105 20.48 15.293 20.293C15.48 20.105 15.735 20 16 20H24Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Notification Options",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M22 17C22 16.47 22.211 15.961 22.586 15.586C22.961 15.211 23.47 15 24 15C24.53 15 25.039 15.211 25.414 15.586C25.789 15.961 26 16.47 26 17C27.148 17.543 28.127 18.388 28.832 19.445C29.537 20.502 29.94 21.731 30 23V26C30.075 26.622 30.295 27.217 30.643 27.738C30.99 28.259 31.455 28.691 32 29H16C16.545 28.691 17.01 28.259 17.357 27.738C17.705 27.217 17.925 26.622 18 26V23C18.06 21.731 18.463 20.502 19.168 19.445C19.873 18.388 20.852 17.543 22 17M21 29V30C21 30.796 21.316 31.559 21.879 32.121C22.441 32.684 23.204 33 24 33C24.796 33 25.559 32.684 26.121 32.121C26.684 31.559 27 30.796 27 30V29"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Language",
    hint: "English (US)",
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M15 19V17H28V19M22 17V31M24 31H20M27 25V24H33V25M30 24V31M29 31H31"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Currency",
    hint: "USD",
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M28.7 20C28.501 19.435 28.137 18.943 27.656 18.587C27.175 18.23 26.598 18.026 26 18H22C21.204 18 20.441 18.316 19.879 18.879C19.316 19.441 19 20.204 19 21C19 21.796 19.316 22.559 19.879 23.121C20.441 23.684 21.204 24 22 24H26C26.796 24 27.559 24.316 28.121 24.879C28.684 25.441 29 26.204 29 27C29 27.796 28.684 28.559 28.121 29.121C27.559 29.684 26.796 30 26 30H22C21.402 29.974 20.825 29.77 20.344 29.414C19.863 29.057 19.499 28.565 19.3 28M24 15V18M24 30V33"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "FAQs",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 33C28.971 33 33 28.971 33 24C33 19.029 28.971 15 24 15C19.029 15 15 19.029 15 24C15 28.971 19.029 33 24 33ZM24 29V29.01M24 25.5C23.982 25.175 24.069 24.854 24.25 24.583C24.43 24.313 24.693 24.108 25 24C25.376 23.856 25.713 23.627 25.986 23.331C26.258 23.035 26.458 22.679 26.569 22.293C26.681 21.906 26.701 21.499 26.629 21.103C26.556 20.707 26.393 20.333 26.151 20.012C25.91 19.69 25.597 19.428 25.237 19.248C24.878 19.067 24.481 18.973 24.079 18.972C23.676 18.971 23.279 19.063 22.918 19.241C22.558 19.42 22.243 19.679 22 20"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Data & Privacy Policy",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M29 23H19C17.895 23 17 23.895 17 25V31C17 32.105 17.895 33 19 33H29C30.105 33 31 32.105 31 31V25C31 23.895 30.105 23 29 23ZM24 29C24.552 29 25 28.552 25 28C25 27.448 24.552 27 24 27C23.448 27 23 27.448 23 28C23 28.552 23.448 29 24 29ZM20 23V19C20 17.939 20.421 16.921 21.172 16.172C21.922 15.421 22.939 15 24 15C25.061 15 26.078 15.421 26.828 16.172C27.579 16.921 28 17.939 28 19V23"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "About Amigo GPT",
    hint: "v2.0.2",
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M24 33C28.971 33 33 28.971 33 24C33 19.029 28.971 15 24 15C19.029 15 15 19.029 15 24C15 28.971 19.029 33 24 33ZM24 20H24.01M23 24H24V28H25"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Send Feedback",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M16 32H20L30.5 21.5C31.03 20.97 31.328 20.25 31.328 19.5C31.328 18.75 31.03 18.03 30.5 17.5C29.97 16.97 29.25 16.672 28.5 16.672C27.75 16.672 27.03 16.97 26.5 17.5L16 28V32ZM25.5 18.5L29.5 22.5"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Contact Us",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M16 15H18C18.265 15 18.52 15.105 18.707 15.293C18.895 15.48 19 15.735 19 16V18C19 18.265 18.895 18.52 18.707 18.707C18.52 18.895 18.265 19 18 19H16C15.735 19 15.48 18.895 15.293 18.707C15.105 18.52 15 18.265 15 18V16C15 15.735 15.105 15.48 15.293 15.293C15.48 15.105 15.735 15 16 15ZM30 15H32C32.265 15 32.52 15.105 32.707 15.293C32.895 15.48 33 15.735 33 16V18C33 18.265 32.895 18.52 32.707 18.707C32.52 18.895 32.265 19 32 19H30C29.735 19 29.48 18.895 29.293 18.707C29.105 18.52 29 18.265 29 18V16C29 15.735 29.105 15.48 29.293 15.293C29.48 15.105 29.735 15 30 15ZM23 15H25C25.265 15 25.52 15.105 25.707 15.293C25.895 15.48 26 15.735 26 16V18C26 18.265 25.895 18.52 25.707 18.707C25.52 18.895 25.265 19 25 19H23C22.735 19 22.48 18.895 22.293 18.707C22.105 18.52 22 18.265 22 18V16C22 15.735 22.105 15.48 22.293 15.293C22.48 15.105 22.735 15 23 15ZM16 22H18C18.265 22 18.52 22.105 18.707 22.293C18.895 22.48 19 22.735 19 23V25C19 25.265 18.895 25.52 18.707 25.707C18.52 25.895 18.265 26 18 26H16C15.735 26 15.48 25.895 15.293 25.707C15.105 25.52 15 25.265 15 25V23C15 22.735 15.105 22.48 15.293 22.293C15.48 22.105 15.735 22 16 22ZM30 22H32C32.265 22 32.52 22.105 32.707 22.293C32.895 22.48 33 22.735 33 23V25C33 25.265 32.895 25.52 32.707 25.707C32.52 25.895 32.265 26 32 26H30C29.735 26 29.48 25.895 29.293 25.707C29.105 25.52 29 25.265 29 25V23C29 22.735 29.105 22.48 29.293 22.293C29.48 22.105 29.735 22 30 22ZM23 22H25C25.265 22 25.52 22.105 25.707 22.293C25.895 22.48 26 22.735 26 23V25C26 25.265 25.895 25.52 25.707 25.707C25.52 25.895 25.265 26 25 26H23C22.735 26 22.48 25.895 22.293 25.707C22.105 25.52 22 25.265 22 25V23C22 22.735 22.105 22.48 22.293 22.293C22.48 22.105 22.735 22 23 22ZM23 29H25C25.265 29 25.52 29.105 25.707 29.293C25.895 29.48 26 29.735 26 30V32C26 32.265 25.895 32.52 25.707 32.707C25.52 32.895 25.265 33 25 33H23C22.735 33 22.48 32.895 22.293 32.707C22.105 32.52 22 32.265 22 32V30C22 29.735 22.105 29.48 22.293 29.293C22.48 29.105 22.735 29 23 29Z"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Invite Friends",
    hint: null,
    danger: false,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#00D061" />
        <path
          d="M21 23C23.209 23 25 21.209 25 19C25 16.791 23.209 15 21 15C18.791 15 17 16.791 17 19C17 21.209 18.791 23 21 23ZM15 33V31C15 29.939 15.421 28.922 16.172 28.172C16.922 27.421 17.939 27 19 27H23C24.061 27 25.078 27.421 25.828 28.172C26.579 28.922 27 29.939 27 31V33M28 23H34M31 20V26"
          stroke="#00D061"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Delete or Deactivate Account",
    hint: null,
    danger: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#FF484D" />
        <path
          d="M22 22L26 26M26 22L22 26"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 15C31.2 15 33 16.8 33 24C33 31.2 31.2 33 24 33C16.8 33 15 31.2 15 24C15 16.8 16.8 15 24 15Z"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Logout",
    hint: null,
    danger: true,
    isLogout: true,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <rect opacity="0.08" width="48" height="48" rx="8" fill="#FF484D" />
        <path
          d="M26 20V18C26 17.47 25.789 16.961 25.414 16.586C25.039 16.211 24.53 16 24 16H17C16.47 16 15.961 16.211 15.586 16.586C15.211 16.961 15 17.47 15 18V30C15 30.53 15.211 31.039 15.586 31.414C15.961 31.789 16.47 32 17 32H24C24.53 32 25.039 31.789 25.414 31.414C25.789 31.039 26 30.53 26 30V28M21 24H33L30 21M30 27L33 24"
          stroke="#FF484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const MENU_ROUTES = {
  "New Chat": "/amigo-chat",
  History: "/settings/history",
  "Banks & Cards": "/settings/banks-cards",
  "Payment Methods": "/settings/payment-methods",
  Credits: "/settings/credits",
  Subscriptions: "/settings/subscriptions",
  "Personal Info": "/personal-information",
  Security: "/settings/security",
  "Marketing Preferences": "/settings/marketing-preferences",
  "Notification Options": "/settings/notification-options",
  Language: "/language",
  Currency: "/settings/currency",
  FAQs: "/settings/faqs",
  "Data & Privacy Policy": "/settings/privacy-policy",
  "About Amigo GPT": "/settings/about-amigo",
  "Send Feedback": "/settings/send-feedback",
  "Contact Us": "/settings/contact-us",
  "Invite Friends": "/settings/invite-friends",
  "Delete or Deactivate Account": "/settings/account-management",
};

const QUICK_ACCESS_ITEMS = [
  {
    label: "Inbox",
    caption: "Unread updates",
    value: "03",
    href: "/notifications",
  },
  {
    label: "Security",
    caption: "Protect access",
    value: "PIN",
    href: "/settings/security",
  },
  {
    label: "Credits",
    caption: "View balance",
    value: "Live",
    href: "/settings/credits",
  },
  {
    label: "Chat",
    caption: "Start fresh",
    value: "Now",
    href: "/amigo-chat",
  },
];

const TODAY_CARDS = [
  {
    title: "Prompt ideas picked for you",
    description: "Based on your interests in code, productivity, and learning.",
    cta: "Open Chat",
    href: "/amigo-chat",
  },
  {
    title: "Settings pass is ready",
    description:
      "Language, notifications, and security pages now have full themed screens.",
    cta: "Review",
    href: "/settings/security",
  },
];

// ─── Dark-mode Toggle Switch ──────────────────────────────────────────────────

const DarkModeToggle = ({ dark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={dark}
    className={`relative w-[50px] h-[28px] rounded-full transition-all duration-300 flex-shrink-0 ${
      dark
        ? "bg-gray-700 border border-gray-600"
        : "bg-gray-300 border border-gray-300"
    }`}
  >
    <span
      className={`absolute top-[3px] w-[22px] h-[22px] rounded-full transition-all duration-300 flex items-center justify-center ${
        dark ? "left-[calc(100%-25px)] bg-gray-900" : "left-[3px] bg-white"
      }`}
    >
      {/* Icon */}
      {dark ? (
        <span className="text-white text-xs">🌙</span>
      ) : (
        <span className="text-yellow-500 text-xs">☀️</span>
      )}
    </span>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { isDark, isUsingSystemTheme, toggleTheme } = useTheme();
  const router = useRouter();
  const { data: profileData, error: profileError } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const [createChat] = useCreateChatMutation();
  const profile = profileData ?? {};
  const profilePhone =
    profile?.phone || profile?.mobile || profile?.user_phone || "";

  useEffect(() => {
    if (!profileError) {
      return;
    }

    if (isUnauthorizedError(profileError)) {
      router.replace("/sign-in");
      return;
    }

    toast.error(getClientErrorMessage(profileError, "Failed to load profile"));
  }, [profileError, router]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      router.replace("/sign-in");
    } catch (error) {
      console.log(error);
      toast.error(getClientErrorMessage(error, "Unable to log out"));
    }
  };

  const handleStartChat = async () => {
    try {
      if (!profilePhone) {
        toast.error("Your profile is still loading. Please try again.");
        return;
      }

      const chat = await createChat({
        user: profilePhone,
        planType: "premium",
      }).unwrap();

      const chatId = String(chat?._id ?? chat?.id ?? "");

      if (!chatId) {
        throw { message: "Unable to open a new conversation" };
      }

      router.push(`/amigo-chat?chat=${chatId}`);
    } catch (error) {
      console.log(error);
      toast.error(getClientErrorMessage(error, "Unable to start a new chat"));
    }
  };

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.name ||
    "";
  const firstName = profile?.first_name || "";
  const emailAddress =
    profile?.email || profile?.user_email || "example@mail.com";
  const navigateTo = (href) => {
    setDrawerOpen(false);
    setLogoutOpen(false);
    router.push(href);
  };
  const themeLabel = isDark ? "Dark mode" : "Light mode";
  const themeStatus = isUsingSystemTheme
    ? "Using your device preference"
    : "Saved for this browser";
  const drawerHoverClass = isDark
    ? "hover:bg-white/5 active:bg-white/10"
    : "hover:bg-[#f9fffe] active:bg-[#E4FFEE]";
  const dangerHoverClass = isDark
    ? "hover:bg-[#35191d] active:bg-[#431f24]"
    : "hover:bg-red-50 active:bg-red-100";

  return (
    <div className="theme-shell min-h-dvh flex justify-center transition-colors duration-300">
      <div className="theme-surface w-full max-w-[600px] min-h-dvh flex flex-col relative overflow-hidden transition-colors duration-300">
        {/* ── Green header background ── */}
        <div className="relative bg-[#00D061] px-4 pt-[30px] pb-4 overflow-hidden">
          {/* Circuit background */}
          <Image
            src="/icons/let-you-screen-main-img.jpg"
            alt=""
            fill
            className="object-cover opacity-20 pointer-events-none"
            priority
          />

          {/* Nav row */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo placeholder */}
              <Image
                src="/icons/logo.png"
                alt=""
                width={36}
                height={36}
                className="object-contain logo-home"
                unoptimized
              />
              <h1 className="text-white text-[18px] font-medium leading-[24px]">
                Amigo GPT
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Bell */}
              <button
                type="button"
                className="relative text-white"
                onClick={() => router.push("/notifications")}
              >
                <Bell />
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#FF484D] rounded-full flex items-center justify-center text-white text-[10px] font-medium">
                  5
                </span>
              </button>
              {/* Hex / settings */}
              <button
                type="button"
                className="text-white"
                onClick={() => setDrawerOpen(true)}
              >
                <Settings />
              </button>
            </div>
          </div>

          {/* Hero text */}
          <div className="relative z-10 mt-9 pb-2">
            <h2 className="text-white text-[32px] font-bold leading-[40px]">
              Hello, {firstName}{" "}
              <span
                className="inline-block"
                style={{
                  transformOrigin: "70% 70%",
                  animation: "wave 2.5s ease-in-out infinite",
                }}
              >
                👋
              </span>
            </h2>
            <h3 className="text-white text-[18px] font-semibold leading-6 mt-3">
              Let&apos;s Have Fun with Amigo!
            </h3>
            <p className="text-[16px] font-satoshi font-medium leading-[24px] pb-3 text-white mt-2 mb-3">
              Start a conversation with Amigo right now!
            </p>
          </div>
        </div>

        {/* ── White card ── */}
        <section className="theme-surface relative -mt-5 flex-1 overflow-y-auto rounded-t-[32px] px-4 pb-28 pt-6 transition-colors duration-300">
          {/* GPT Plus promo card */}
          <div className="theme-card-soft mb-5 flex items-stretch justify-between overflow-hidden rounded-[12px] transition-colors duration-300">
            <div className="p-3 flex flex-col justify-between">
              <div>
                <h4 className="text-[#0F0F0F] text-[22px] font-semibold leading-[30px]">
                  Amigo GPT Plus
                </h4>
                <p className="text-[#555] text-[14px] font-medium leading-6 mt-1 max-w-[180px]">
                  Unlock Amigo premium to unlock all features.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/plus-subscription")}
                className="theme-surface mt-4 self-start rounded-[8px] px-4 py-[10px] text-[14px] font-semibold text-[#00D061] transition-all duration-300 active:scale-[0.97]"
              >
                Upgrades
              </button>
            </div>
            {/* Robot placeholder */}
            <div className="w-[110px] bg-[#00D061]/50 flex items-end justify-end rounded-r-[12px]">
              <Image
                src="/icons/plus-robort.png"
                alt=""
                width={96}
                height={96}
                className="size-24 object-contain"
              />
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="text-[#0F0F0F] text-[20px] font-semibold leading-7">
                  Quick access
                </h4>
                <p className="text-[#555] font-satoshi text-[14px] leading-6">
                  Fast ways to move around the app.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACCESS_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className="theme-card rounded-[22px] border px-4 py-4 text-left transition-all duration-300 hover:-translate-y-[1px]"
                >
                  <span className="inline-flex rounded-full bg-[#E8FFF1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#00A84D]">
                    {item.value}
                  </span>
                  <h5 className="mt-3 text-[#0F0F0F] text-[17px] font-semibold leading-6">
                    {item.label}
                  </h5>
                  <p className="mt-1 font-satoshi text-[13px] leading-5 text-[#555]">
                    {item.caption}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <h4 className="text-[#0F0F0F] text-[20px] font-semibold leading-7">
                Today with Amigo
              </h4>
              <p className="text-[#555] font-satoshi text-[14px] leading-6">
                A few guided places to keep momentum going.
              </p>
            </div>

            <div className="space-y-3">
              {TODAY_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="theme-card-muted rounded-[22px] border px-4 py-4"
                >
                  <h5 className="text-[#0F0F0F] text-[17px] font-semibold leading-6">
                    {card.title}
                  </h5>
                  <p className="mt-1 font-satoshi text-[14px] leading-6 text-[#555]">
                    {card.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push(card.href)}
                    className={`mt-4 inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold ${
                      isDark
                        ? "bg-[#00D061] text-[#07110d]"
                        : "bg-[#0F0F0F] text-white"
                    }`}
                  >
                    {card.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Start Chat fixed button ── */}
        <div className="fixed bottom-5 left-0 right-0 mx-auto max-w-[600px] px-4 z-10">
          <button
            type="button"
            onClick={() => handleStartChat()}
            className="w-full max-w-[343px] mx-auto flex items-center justify-center h-[56px] rounded-[12px] bg-[#00D061] text-white text-[18px] font-medium shadow-[0_4px_20px_rgba(0,208,97,0.4)] transition-all active:scale-[0.98] hover:opacity-92"
          >
            Start Chat with Amigo
          </button>
        </div>

        {/* ══════════════════════════════════════════════
            SETTINGS DRAWER (left slide-in)
        ══════════════════════════════════════════════ */}

        {/* Backdrop */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Drawer panel */}
        <div
          className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } theme-surface-elevated`}
        >
          {/* Drawer header */}
          <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-4">
            <h5 className="theme-text-primary text-[18px] font-medium">
              Settings
            </h5>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="theme-text-primary text-[24px] leading-none"
            >
              <X />
            </button>
          </div>

          {/* Profile row */}
          <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="theme-surface-soft flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-[28px] transition-colors duration-300">
                👩
              </div>
              <div>
                <p className="theme-text-primary text-[16px] font-medium">
                  {displayName}
                </p>
                <p className="text-[14px] text-[#555]">{emailAddress}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("/personal-information")}
            >
              <Edit2Icon className="text-[#00D061]" />
            </button>
          </div>

          {/* Scrollable menu */}
          <div className="flex-1 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#ccc]">
            {MENU_ITEMS.map((item) => {
              if (item.isLogout) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setLogoutOpen(true);
                    }}
                    className={`theme-border-strong w-full flex items-center justify-between border-b-2 px-4 py-2 transition-colors ${dangerHoverClass}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span className="text-[#FF484D] text-[15px] font-medium">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRightIcon />
                  </button>
                );
              }

              // Dark mode row
              if (item.label === "Light Mode" || item.label === "Dark Mode")
                return null;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    const href = MENU_ROUTES[item.label];

                    if (!href) {
                      toast.error("This page is not mapped yet.");
                      return;
                    }

                    navigateTo(href);
                  }}
                  className={`theme-border-strong w-full flex items-center justify-between border-b-2 px-4 py-2 transition-colors ${drawerHoverClass}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {item.icon}
                    <span
                      className={`truncate text-[15px] font-medium ${item.danger ? "text-[#FF484D]" : "theme-text-primary"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {item.hint && (
                      <span className="text-[13px] text-[#555]">
                        {item.hint}
                      </span>
                    )}
                    <ChevronRightIcon className="text-[#00D061]" />
                  </div>
                </button>
              );
            })}

            {/* Dark mode toggle row */}
            <div className="theme-border-strong flex items-center justify-between border-b-2 px-4 py-3">
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <rect
                    opacity="0.08"
                    width="48"
                    height="48"
                    rx="8"
                    fill="#00D061"
                  />
                  <path
                    d="M24 26C25.105 26 26 25.105 26 24C26 22.895 25.105 22 24 22C22.895 22 22 22.895 22 24C22 25.105 22.895 26 24 26ZM34 24C31.333 28.667 28 31 24 31C20 31 16.667 28.667 14 24C16.667 19.333 20 17 24 17C28 17 31.333 19.333 34 24Z"
                    stroke="#00D061"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p className="theme-text-primary text-[15px] font-medium">
                    {themeLabel}
                  </p>
                  <p className="theme-text-secondary text-[12px] leading-5">
                    {themeStatus}
                  </p>
                </div>
              </div>
              <DarkModeToggle dark={isDark} onToggle={toggleTheme} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            LOGOUT BOTTOM SHEET
        ══════════════════════════════════════════════ */}

        {/* Backdrop */}
        {logoutOpen && (
          <div
            className="fixed inset-0 z-40"
            style={{
              background:
                "linear-gradient(180deg,rgba(18,18,18,.56) 0%,rgba(18,18,18,.24) 100%)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setLogoutOpen(false)}
          />
        )}

        {/* Bottom sheet */}
        <div
          className={`theme-surface-elevated fixed left-0 right-0 mx-auto max-w-[600px] rounded-t-[24px] px-4 pb-8 pt-4 transition-all duration-300 ease-in-out z-50 ${
            logoutOpen
              ? "translate-y-0 bottom-0"
              : "translate-y-full -bottom-full"
          }`}
        >
          {/* Pull handle */}
          <div className="flex justify-center mb-4">
            <button type="button" onClick={() => setLogoutOpen(false)}>
              <CollapseIcon />
            </button>
          </div>
          <h2 className="theme-text-primary mb-3 text-center text-[20px] font-semibold leading-[30px]">
            Logout
          </h2>
          <p className="theme-text-secondary mb-6 text-center text-[18px] font-medium leading-6">
            Are you sure you want to log out?
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setLogoutOpen(false)}
              className="theme-card-soft rounded-[12px] px-8 py-[18px] text-[18px] font-medium text-[#00D061] transition-all duration-300 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleLogout()}
              className="text-white text-[18px] font-medium px-8 py-[18px] rounded-[12px] bg-[#00D061] transition-all active:scale-[0.97]"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>

      {/* Wave animation keyframes */}
      <style>{`
        @keyframes wave {
          0%   { transform: rotate(0deg); }
          10%  { transform: rotate(14deg); }
          20%  { transform: rotate(-8deg); }
          30%  { transform: rotate(14deg); }
          40%  { transform: rotate(-4deg); }
          50%  { transform: rotate(10deg); }
          60%  { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
