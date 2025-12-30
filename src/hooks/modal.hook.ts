// Basic Modal Hook
import { useState } from "react";
import { Modal } from "antd";

export const useModal = () => {
  const [modal, contextHolder] = Modal.useModal();

  const openModal = (content: React.ReactNode, options?: any) => {
    Modal.info({
      content,
      icon: null,
      okButtonProps: { style: { display: "none" } }, // Hide default OK button to let content handle it
      width: options?.width || 520,
      centered: true,
      maskClosable: true,
      footer: null,
      ...options,
    });
  };

  const closeModal = () => {
    Modal.destroyAll();
  };

  return {
    modal,
    contextHolder,
    openModal,
    closeModal,
  };
};
