"use client";
import React from "react";
import { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { userService } from "_helpers";
import { useMutation } from "react-query";
import { userapi } from "_api";

export default function FormElements(title, input) {
  const mutation = useMutation(
    async (data) => {
      try {
        const updatedData = await userapi.editFirstName(data);
        return updatedData;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        console.log(firstName);
      },
      onError: (error) => {},
    }
  );

  const [openModal, setOpenModal] = useState(false);
  const [firstName, setfirstName] = useState(userService.currentUser.firstName);
  const props = {
    openModal,
    setOpenModal,
    firstName,
    setfirstName,
  };

  return (
    <>
      <Button onClick={() => props.setOpenModal("form-elements")}>
        Toggle modal
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="sm"
        position="bottom-center"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit name
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="FirstName" value="FirstName" />
              </div>
              <TextInput
                id="FirstName"
                defaultValue={firstName}
                onChange={(e) => props.setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <Button
                onClick={() => mutation.mutate({ firstName: props.firstName })}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
