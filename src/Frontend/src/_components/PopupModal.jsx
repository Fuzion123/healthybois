"use client";
import React from "react";
import { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { userService } from "_helpers";
import { useMutation } from "react-query";
import { userapi } from "_api";

export default function FormElements({title, modalName, children }) {
  const mutation = useMutation(
  async (data) => {
    
    const response = await userapi.editFirstName(data);
    return response.data; // Adjust this based on your API response structure
  },
  {
    onSuccess: (data) => {
      console.log("Update successful:", data);
      // You can also update the local state here if needed
    },
    onError: (error) => {
      console.error("Update failed:", error);
      // You can display an error message to the user
    },
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

  const modalId = modalName;
  
  return (
    <>
      <Button onClick={() => props.setOpenModal(modalId)}>
        Toggle modal
      </Button>
      <Modal
        show={props.openModal === modalId}
        size="sm"
        position="bottom-center"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              { title }
            </h3>
            {children}
            <div>              
                <div className="mb-2 block">
                  <Label htmlFor="FirstName" value="FirstName" />
                </div>
                <TextInput
                  id="FirstName"
                  defaultValue={firstName}
                  onChange={(e) => props.setfirstName(e.target.value)}
                  required
                />
            </div>
            <div>
               {firstName}
            </div>            
            <div className="w-full">
              <Button
                onClick={() => mutation.mutate({ firstName: firstName })}
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
