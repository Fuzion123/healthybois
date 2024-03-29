import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { authActions } from "_store";
import { Avatar } from "@mui/material";

export { Nav };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Nav() {
  const auth = useSelector((x) => x.auth.value);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  const { pathname } = useLocation();

  // only show nav when logged in
  if (!auth) return null;

  if (auth.isAdmin === false) {
    return (
      <Disclosure as="nav" className="bg-gray-800">
        {({ open, close }) => (
          <>
            <div className="mx-auto max-w-10xl sm:w-full sm:max-w-lg md:max-w-screen-lg px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <NavLink to="/" className="">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="/logo.png"
                        alt="Healthybois"
                      />
                    </NavLink>
                    <NavLink to="/" className="">
                      {" "}
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="/logo.png"
                        alt="Healthybois"
                      />
                    </NavLink>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      <NavLink
                        to="/"
                        className="text-white hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium"
                      >
                        Home
                      </NavLink>
                      <NavLink
                        to="/events"
                        className="text-white hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium"
                      >
                        Events
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <Avatar
                          alt={auth?.firstName}
                          src={auth?.profilePictureUrl}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/profile/YourProfile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="www.test.dk"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <motion.div
                initial="hidden"
                animate={open ? "visible" : "hidden"}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.1,
                      staggerChildren: 0.1,
                    },
                  },
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },
                }}
                className="px-2 pt-2 pb-3 space-y-1"
              >
                <div className="space-y-1 px-2 pb-3 pt-2">
                  <Disclosure.Button className="">
                    <motion.div
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                      }}
                    >
                      <NavLink
                        to="/"
                        onClick={close}
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                          pathname === "/"
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        Home
                      </NavLink>
                    </motion.div>
                    <motion.div
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 },
                      }}
                    >
                      <NavLink
                        to="/events"
                        onClick={close}
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                          pathname === "/events"
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        Events
                      </NavLink>
                    </motion.div>
                  </Disclosure.Button>
                </div>
              </motion.div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <NavLink to="/" className="">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="/logo.png"
                      alt="Healthybois"
                    />
                  </NavLink>
                  <NavLink to="/" className="">
                    {" "}
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="/logo.png"
                      alt="Healthybois"
                    />
                  </NavLink>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <NavLink
                      to="/"
                      className="text-white hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium"
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/users"
                      className="text-white hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium"
                    >
                      Users
                    </NavLink>
                    <NavLink
                      to="/events"
                      className="text-white hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium"
                    >
                      Events
                    </NavLink>
                    <NavLink
                      to="/admin"
                      className="text-white hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium"
                    >
                      Admin
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <Avatar
                        alt={auth?.firstName}
                        src={auth?.profilePictureUrl}
                        sx={{ width: 32, height: 32 }}
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/profile/YourProfile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="www.test.dk"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <motion.div
              initial="hidden"
              animate={open ? "visible" : "hidden"}
              variants={{
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.1,
                    staggerChildren: 0.1,
                  },
                },
                hidden: {
                  opacity: 0,
                  y: -20,
                },
              }}
              className="px-2 pt-2 pb-3 space-y-1"
            >
              <div className="space-y-1 px-2 pb-3 pt-2">
                <Disclosure.Button className="">
                  <motion.div
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -20 },
                    }}
                  >
                    <NavLink
                      to="/"
                      onClick={close}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${
                        pathname === "/"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      Home
                    </NavLink>
                  </motion.div>
                  <motion.div
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -20 },
                    }}
                  >
                    <NavLink
                      to="/users"
                      onClick={close}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${
                        pathname === "/users"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      Users
                    </NavLink>
                  </motion.div>
                  <motion.div
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -20 },
                    }}
                  >
                    <NavLink
                      to="/events"
                      onClick={close}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${
                        pathname === "/events"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      Events
                    </NavLink>
                    <NavLink
                      to="/admin"
                      onClick={close}
                      className={`block rounded-md px-3 py-2 text-base font-medium ${
                        pathname === "/events"
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      Admin
                    </NavLink>
                  </motion.div>
                </Disclosure.Button>
              </div>
            </motion.div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
