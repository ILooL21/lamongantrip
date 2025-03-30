import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useReplyMailMutation } from "../../../slices/contactApiSlice";
import "../../../styles/MailModal.css";

const MailModal = ({ onClose, selectedMailData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: selectedMailData.id,
    email: selectedMailData.email,
    subject: selectedMailData.subject,
    message: selectedMailData.message,
    reply_message: "",
  });

  const [replyMail, { isLoading }] = useReplyMailMutation();

  useEffect(() => {
    showModal();
    setLoading(false);
  }, [selectedMailData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    if (onClose) onClose(); // Memberi tahu induk bahwa modal ditutup
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Menggunakan name, bukan id
    }));
  };

  const handleReply = async () => {
    try {
      const res = await replyMail({ id: formData.id, message: formData.reply_message }).unwrap();

      if (!isLoading) {
        console.log("Reply mail response:", res);
      }
    } catch (error) {
      console.error("Error replying mail:", error);
    }
  };

  return (
    <>
      <Modal
        title="Balas Email"
        open={isModalOpen}
        onCancel={handleCancel}
        loading={loading}
        footer={[
          <Button
            key="reply"
            type="primary"
            onClick={handleReply}>
            Balas
          </Button>,
          <Button
            key="back"
            onClick={handleCancel}>
            Tutup
          </Button>,
        ]}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <p>{formData.email}</p>
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <p>{formData.subject}</p>
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            value={formData.message}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="reply_message">Reply Message</label>
          <textarea
            className="form-control"
            id="reply_message"
            name="reply_message"
            value={formData.reply_message}
            onChange={handleChange}
          />
        </div>
      </Modal>
    </>
  );
};

MailModal.propTypes = {
  onClose: PropTypes.func,
  selectedMailData: PropTypes.object,
};

export default MailModal;
