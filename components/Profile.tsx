import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Mic, CogIcon } from '@/components/icons';
import { generateCREInsights } from '@/utilities/aiText';
import { handleVoiceInput } from '@/utilities/aiVoice'; // Import voice utility
import Soundbar from '@/components/Soundbar';

const Profile: React.FC = () => {
  const [textPrompt, setTextPrompt] = useState('');
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false); // To track if voice recording is active
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [recordingTimeout, setRecordingTimeout] = useState<NodeJS.Timeout | null>(null);

  const profileModalRef = useRef<HTMLDivElement | null>(null);
  const textModalRef = useRef<HTMLDivElement | null>(null);
  const voiceModalRef = useRef<HTMLDivElement | null>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileModalRef.current &&
        !profileModalRef.current.contains(event.target as Node) &&
        textModalRef.current &&
        !textModalRef.current.contains(event.target as Node) &&
        voiceModalRef.current &&
        !voiceModalRef.current.contains(event.target as Node)
      ) {
        setIsProfileModalOpen(false);
        setIsTextModalOpen(false);
        setIsVoiceModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle text-based AI prompts
  const handleTextSubmit = async () => {
    const insights = await generateCREInsights([
      {
        propertyId: 'property1',
        propertyName: 'Sample Property',
        value: 500000,
        noi: 50000,
        leverage: 0.65,
        dscr: 1.4,
        ownershipPercentage: 100,
        location: 'Salt Lake City, UT',
        latitude: 40.7143,
        longitude: -111.8548,
      },
    ]);
    setTextResponse(insights);
  };

  // Start voice recording using the handleVoiceInput utility
  const startVoiceRecording = () => {
    setIsRecording(true);

    handleVoiceInput(
      [
        {
          propertyId: 'property1',
          propertyName: 'Sample Property',
          value: 500000,
          noi: 50000,
          leverage: 0.65,
          dscr: 1.4,
          ownershipPercentage: 100,
          location: 'Salt Lake City, UT',
          latitude: 40.7143,
          longitude: -111.8548,
        },
      ],
      (insights) => {
        setVoiceResponse(insights); // Update state with the voice response
        setIsRecording(false); // Stop recording after receiving response
      }
    );
  };

  // Stop recording manually
  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (recordingTimeout) {
      clearTimeout(recordingTimeout);
    }
  };

  return (
    <div className="profile-container">
      {/* Icons aligned horizontally */}
      <div className="icon-row">
        <button className="icon-button" onClick={() => setIsTextModalOpen(true)} title="Open AI text prompt">
          <Pencil className="icon" />
        </button>
        <button className="icon-button" onClick={() => setIsVoiceModalOpen(true)} title="Open voice command">
          <Mic className="icon" />
        </button>
        <button className="icon-button" onClick={() => setIsProfileModalOpen(true)} title="Open profile settings">
          <CogIcon className="icon" />
        </button>
      </div>

      {/* Profile Settings Modal */}
      {isProfileModalOpen && (
        <div className="modal profile-settings-modal" ref={profileModalRef}>
          <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}></div>
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsProfileModalOpen(false)}>&times;</button>
            <h4>Profile Settings</h4>
            <ul>
              <li>Update Profile</li>
              <li>Change Password</li>
              <li>Log Out</li>
            </ul>
          </div>
        </div>
      )}

      {/* Text Prompt Modal */}
      {isTextModalOpen && (
        <div className="modal text-prompt-modal" ref={textModalRef}>
          <div className="modal-overlay" onClick={() => setIsTextModalOpen(false)}></div>
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsTextModalOpen(false)}>&times;</button>
            <h4>Enter AI Prompt</h4>
            <p className="instruction">Please enter your prompt below, and click 'Submit' to receive insights.</p>
            <textarea
              className="text-input"
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={5} 
            />
            <button className="submit-button" onClick={handleTextSubmit}>Submit</button>
            {textResponse && (
              <div className="response-box">
                <h5>AI Response:</h5>
                <p>{textResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voice Command Modal */}
      {isVoiceModalOpen && (
        <div className="modal voice-command-modal" ref={voiceModalRef}>
          <div className="modal-overlay" onClick={() => setIsVoiceModalOpen(false)}></div>
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsVoiceModalOpen(false)}>&times;</button>
            <h4 className="font-bold mb-8">Tell Me What To Do</h4>
            {isRecording ? (
              <div className="recording-status">
                <p>Recording... Please speak now.</p>
                <Soundbar /> {/* Display soundbar while recording */}
                <button className="stop-button" onClick={stopVoiceRecording}>Stop Recording</button>
              </div>
            ) : (
              <button className="record-button" onClick={startVoiceRecording}>
               Click to Record or Say Hey "AiCRE"
              </button>
            )}
            {voiceResponse && (
              <div className="response-box">
                <h5>AI Response:</h5>
                <p>{voiceResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-container {
          padding: 10px;
          text-align: center;
        }

        .icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 150px;
          margin: 0 auto;
          margin-bottom: 15px;
        }

        .icon-button {
          background-color: black;
          border: none;
          cursor: pointer;
          transition: transform 0.3s, color 0.3s;
        }

        .icon-button:hover {
          transform: scale(1.1);
        }

        .icon {
          font-size: 24px;
          transition: color 0.3s;
        }

        .icon-button:hover .icon {
          color: #5fd2d2;
        }

        .recording .icon {
          color: red;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .modal-content {
          position: relative;
          z-index: 2;
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          min-width: 300px;
          max-width: 600px;
          width: 90%;
        }

        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          color: black;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .text-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }

        .response-box {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 5px;
          color: #333;
        }

        button {
          padding: 5px 10px;
          background-color: #5fd2d2;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #4bb7b7;
        }

        .submit-button,
        .record-button,
        .stop-button {
          width: 100%;
          padding: 10px;
          background-color: #5fd2d2;
          color: white;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-button:hover,
        .record-button:hover,
        .stop-button:hover {
          background-color: #4bb7b7;
        }

        .recording-status {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @media (max-width: 768px) {
          .text-input {
            font-size: 14px;
          }

          .submit-button,
          .record-button,
          .stop-button {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
