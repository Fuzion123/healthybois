"use client";
import React from "react";
import { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useQueryClient, useMutation } from "react-query";
import { userapi } from "_api";


export default function FormElements({...props }) {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
  async (data) => {
    
    await userapi.editFirstName(data);   
  },
  {
    onSuccess: (data) => {
      console.log("Update successful:");
      // You can also update the local state here if needed
      queryClient.invalidateQueries({
          queryKey: [`/users/${props.userData.id}`],
        });
      properties.setOpenModal(undefined);  
    },
    onError: (error) => {
      console.error("Update failed:");
      // You can display an error message to the user
    },
  }
);

  const [openModal, setOpenModal] = useState();
  const [firstName, setfirstName] = useState(props.userData.firstName);
  const properties = {
    openModal,
    setOpenModal,
    firstName,
    setfirstName,
  };

  const modalId = props.modalName;
  
  return (
    <>
      <Button onClick={() => properties.setOpenModal(modalId)}>
        Toggle modal
      </Button>
      <Modal
        show={properties.openModal === modalId}
        size="sm"
        position="bottom-center"
        popup
        onClose={() => properties.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              { props.title }
            </h3>
            {props.children}
            <div>              
                <div className="mb-2 block">
                  <Label htmlFor="FirstName" value="FirstName" />
                </div>
                <TextInput
                  id="FirstName"
                  defaultValue={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                  required
                />
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
