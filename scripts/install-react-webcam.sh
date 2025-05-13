#!/bin/bash
# Alternative script to install react-webcam package

echo "Installing react-webcam package..."
npm install react-webcam

if [ $? -eq 0 ]; then
  echo "react-webcam installed successfully."
else
  echo "Failed to install react-webcam. Please check your npm setup."
fi
