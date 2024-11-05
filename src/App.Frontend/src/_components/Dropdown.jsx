import { useState } from "react";

export default function Dropdown({ currentOption, setCurrentOption, options }) {
  const [show, setShow] = useState(false);

  if (!options || options === null || options.length === 0) {
    return <></>;
  }

  return (
    <div class="relative inline-block text-left">
      <div>
        <button
          type="button"
          class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
        >
          {currentOption}
          <svg
            class="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        class="absolute right-100 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
        hidden={!show}
      >
        <div class="py-1" role="none">
          {options.map((option) => {
            let isCurrent = option === currentOption;

            return (
              <button
                className={`block py-1.5 text-sm text-gray-700 disabled:text-gray-400 ${
                  isCurrent ? "pr-4 pl-2" : "px-4"
                }`}
                role="menuitem"
                tabindex="-1"
                id="menu-item-0"
                disabled={isCurrent}
                onClick={() => {
                  setShow(false);
                  setCurrentOption(option);
                }}
              >
                {isCurrent ? `✔ ${option}` : option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
