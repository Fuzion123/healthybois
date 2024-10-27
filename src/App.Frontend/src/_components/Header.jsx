import BackButton from "./BackButton";
// import { Modal } from "flowbite";

// /*
//  * $targetEl: required
//  * options: optional
//  */
// const $targetEl = document.getElementById("header-cancel-modal");

// const modal = new Modal($targetEl);

export { Header };

function Header({ ...props }) {
  return (
    <div className="flex flex-row items-center">
      <div id="header-cancel-modal"></div>
      <div>
        <BackButton overwriteClickHandler={props.overwriteClickHandler} />
      </div>
      <div className="grow mr-6">
        <h1 className="text-2xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl">
          {props.title}
        </h1>
      </div>
      <div>{props.settings}</div>
    </div>
  );
}
