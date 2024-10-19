import React, { useEffect, useRef } from 'react';

interface ProfileProps {
  onClose: () => void; // Function to handle closing
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close the modal if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Close the modal if clicked outside
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="profile-settings" ref={modalRef}>
      <h4>User Settings</h4>
      <ul>
        <li>Update Profile</li>
        <li>Change Password</li>
        <li>Log Out</li>
      </ul>

      {/* Styles */}
      <style jsx>{`
        .profile-settings {
          position: absolute;
          top: 160px; /* Adjust based on the cog wheel position */
          left: 39px; /* Ensure it displays next to the cog wheel */
          background-color: white;
          padding: 20px;
          border: 1px solid #ddd;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          z-index: 1000; /* High z-index to stay on top */
          min-width: 180px;
          transition: all 0.3s ease-in-out;
        }

        .profile-settings h4 {
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }

        .profile-settings ul {
          list-style: none;
          padding: 0;
        }

        .profile-settings li {
          padding: 8px 0;
          cursor: pointer;
          font-size: 14px;
          color: #555;
        }

        .profile-settings li:hover {
          color: #98fbcb;
        }

        /* Mobile-friendly styling */
        @media (max-width: 768px) {
          .profile-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
            padding: 20px;
            z-index: 1000;
          }
        }

        @media (max-width: 480px) {
          .profile-settings {
            width: 100%;
            padding: 15px;
          }

          .profile-settings h4 {
            font-size: 18px;
          }

          .profile-settings li {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
