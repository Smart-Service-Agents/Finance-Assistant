#!/bin/bash
echo "Installing dependencies from requirements.txt..."
source /var/app/venv/*/bin/activate
pip install -r requirements.txt
