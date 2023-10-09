import BackButton from "./BackButton";
// import { Modal } from "flowbite";

// /*
//  * $targetEl: required
//  * options: optional
//  */
// const $targetEl = document.getElementById("header-cancel-modal");

// const modal = new Modal($targetEl);

export { Header };

function Header({ title, overwriteClickHandler }) {
  return (
    <div className="flex flex-row">
      <div id="header-cancel-modal"></div>
      <div>
        <BackButton overwriteClickHandler={overwriteClickHandler} />
      </div>
      <div className="grow mr-6">
        <h1 className="text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
